const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Récupérer toutes les tâches de l'utilisateur
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
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer une nouvelle tâche
router.post('/', auth, async (req, res) => {
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
    res.status(400).json({ message: 'Erreur lors de la création de la tâche' });
  }
});

// Mettre à jour une tâche
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, parentTaskId } = req.body;
    const task = await Task.findOne({ 
      where: { 
        id: req.params.id, 
        userId: req.user.id 
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    await task.update({
      title: title || task.title,
      description: description || task.description,
      status: status || task.status,
      parentTaskId: parentTaskId || task.parentTaskId
    });

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la tâche' });
  }
});

// Supprimer une tâche
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Task.destroy({ 
      where: { 
        id: req.params.id, 
        userId: req.user.id 
      }
    });

    if (!result) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la tâche' });
  }
});

module.exports = router; 