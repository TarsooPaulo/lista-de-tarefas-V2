const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    // Verifica se já existe um usuário cadastrado com esse username
    const existingUser = await User.findOne({ username: username.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Este nome de usuário já está em uso.' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username: username.toLowerCase().trim(),
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor ao cadastrar usuário.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ error: 'Usuário ou senha incorretos.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Usuário ou senha incorretos.' });
    }

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, user: { id: user._id, name: user.name, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor ao realizar login.' });
  }
});

module.exports = router;