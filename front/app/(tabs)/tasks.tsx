import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Task } from '@/app/interfaces/Task';
import { getTasks, deleteTask } from '@/app/services/taskService';
import { TaskModal } from '@/app/components/AddTaskModal';
import { DeleteConfirmationModal } from '@/app/components/DeleteConfirmationModal';
import { Ionicons } from '@expo/vector-icons';

interface OrganizedTask extends Task {
  childTasks?: Task[];
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState<OrganizedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | undefined>();

  useEffect(() => {
    fetchTasks();
  }, []);

  const organizeTasks = (taskList: Task[]): OrganizedTask[] => {
    // Separate parent and child tasks
    const parentTasks: OrganizedTask[] = taskList.filter(task => !task.parentTaskId);
    const childTasks = taskList.filter(task => task.parentTaskId);

    // Add child tasks to their respective parents
    return parentTasks.map(parent => ({
      ...parent,
      childTasks: childTasks.filter(child => child.parentTaskId === parent.id)
    }));
  };

  const fetchTasks = async () => {
    try {
      const tasksData = await getTasks();
      const organizedTasks = organizeTasks(tasksData);
      setTasks(organizedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalVisible(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete.id);
      await fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setIsDeleteModalVisible(false);
      setTaskToDelete(undefined);
    }
  };

  const renderChildTask = (task: Task) => (
    <View style={styles.childTaskItem} key={task.id}>
      <View style={styles.taskRow}>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
          <Text style={styles.taskStatus}>Status: {task.status}</Text>
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditTask(task)}
          >
            <Ionicons name="pencil" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteTask(task)}
          >
            <Ionicons name="trash" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderTask = ({ item }: { item: OrganizedTask }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskRow}>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
          <Text style={styles.taskStatus}>Status: {item.status}</Text>
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditTask(item)}
          >
            <Ionicons name="pencil" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteTask(item)}
          >
            <Ionicons name="trash" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      {item.childTasks && item.childTasks.length > 0 && (
        <View style={styles.childTasksContainer}>
          {item.childTasks.map(renderChildTask)}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedTask(undefined);
          setIsTaskModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <TaskModal
        visible={isTaskModalVisible}
        onClose={() => {
          setIsTaskModalVisible(false);
          setSelectedTask(undefined);
        }}
        onTaskSaved={() => {
          setIsTaskModalVisible(false);
          setSelectedTask(undefined);
          fetchTasks();
        }}
        task={selectedTask}
      />

      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onClose={() => {
          setIsDeleteModalVisible(false);
          setTaskToDelete(undefined);
        }}
        onConfirm={confirmDelete}
        taskTitle={taskToDelete?.title || ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  childTasksContainer: {
    marginTop: 8,
    marginLeft: 16,
  },
  childTaskItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
  },
  taskStatus: {
    fontSize: 12,
    color: '#6c757d',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    margin: 16,
    marginBottom: 0,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskContent: {
    flex: 1,
    paddingRight: 16,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
}); 