const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const validate = require('../middleware/validateRequest');
const { createTaskValidator, updateTaskValidator } = require('../validators/taskValidators');

// Get all user tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Task,
        as: 'parentTask',
        attributes: ['id', 'title']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    console.log(error); 
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post('/', auth, createTaskValidator, validate, async (req, res) => {
  try {
    const { title, description, parentTaskId } = req.body;
    
    const task = await Task.create({
      title,
      description,
      parentTaskId,
      userId: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task' });
  }
});

// Update a task
router.put('/:id', auth, updateTaskValidator, validate, async (req, res) => {
  try {
    const { title, description, status, parentTaskId } = req.body;
    const task = await Task.findOne({ 
      where: { 
        id: req.params.id, 
        userId: req.user.id 
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({
      title: title || task.title,
      description: description || task.description,
      status: status || task.status,
      parentTaskId: parentTaskId || task.parentTaskId
    });

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Task.destroy({ 
      where: { 
        id: req.params.id, 
        userId: req.user.id 
      }
    });

    if (!result) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router; 