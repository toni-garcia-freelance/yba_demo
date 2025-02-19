import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createTask, updateTask } from '../services/taskService';
import { Task } from '../interfaces/Task';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onTaskSaved: () => void;
  task?: Task;  // If provided, we're in edit mode
}

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onClose,
  onTaskSaved,
  task
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status as TaskStatus);
    } else {
      // Reset form when opening for new task
      setTitle('');
      setDescription('');
      setStatus('TODO');
    }
  }, [task, visible]);

  const handleSubmit = async () => {
    try {
      if (task) {
        // Update existing task
        await updateTask(task.id, {
          title,
          description,
          status
        });
      } else {
        // Create new task
        await createTask({
          title,
          description,
          status
        });
      }
      
      // Reset form and notify parent
      setTitle('');
      setDescription('');
      setStatus('TODO');
      onTaskSaved();
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {task ? 'Edit Task' : 'Add New Task'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Status:</Text>
            <Picker
              selectedValue={status}
              style={styles.picker}
              onValueChange={(itemValue: TaskStatus) => setStatus(itemValue)}
            >
              <Picker.Item label="To Do" value="TODO" />
              <Picker.Item label="In Progress" value="IN_PROGRESS" />
              <Picker.Item label="Done" value="DONE" />
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.buttonSubmit]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {task ? 'Save Changes' : 'Add Task'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: '#6c757d',
  },
  buttonSubmit: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 