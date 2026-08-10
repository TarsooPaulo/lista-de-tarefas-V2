const express = require('express');
const router = express.Router();
const Task = require('../Models/Task');
const auth = require('../Middlewares/auth');

// 1. OBTER TAREFAS
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Erro ao buscar tarefas:', err);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
});

// 2. CRIAR TAREFA (LIMITE DE 10 TAREFAS)
router.post('/', auth, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'O título da tarefa é obrigatório.' });
    }

    const userId = req.user.id || req.user._id;

    const taskCount = await Task.countDocuments({ userId });

    if (taskCount >= 10) {
      return res.status(400).json({ 
        error: 'Você atingiu o limite máximo de 10 tarefas por conta.' 
      });
    }

    const newTask = new Task({
      title: title.trim(),
      userId
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Erro detalhado ao criar tarefa:', err);
    res.status(500).json({ error: err.message || 'Erro ao criar tarefa.' });
  }
});

// 3. ATUALIZAR TAREFA
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, completed } = req.body;
    const userId = req.user.id || req.user._id;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId }, // Corrigido para userId minúsculo
      { title, completed },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou sem permissão.' });
    }

    res.json(task);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ message: 'Erro ao atualizar' });
  }
});

// 4. EXCLUIR TAREFA
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Corrigido de UserId para userId (minúsculo) e removido getUserId desnecessário
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: userId 
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou sem permissão.' });
    }
    
    res.json({ message: 'Tarefa deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ message: 'Erro ao deletar' });
  }
});

module.exports = router;