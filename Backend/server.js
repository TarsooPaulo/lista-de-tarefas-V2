const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Importação das Rotas
const authRoutes = require('./Routes/auth');
const taskRoutes = require('./Routes/tasks');

// Uso das Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes)

// Rota de teste simples para verificar se a API está online
app.get('/', (req, res) => {
  res.json({ message: 'Backend da Lista de Tarefas rodando com sucesso!' });
});

// Porta do servidor (pega do .env ou usa a 5000 como padrão)
const PORT = process.env.PORT || 5000;

// Função para iniciar o servidor apenas APÓS conectar no Banco de Dados
async function iniciarServidor() {
  try {
    // Tenta conectar ao MongoDB Atlas usando a string do .env
    await mongoose.connect(process.env.MONGO_URI);

    // Sobe o servidor Express
    app.listen(PORT, () => {
    });
  } catch (error) {
    console.error('❌ Erro crítico: Falha ao conectar ao MongoDB:', error.message);
  }
}

iniciarServidor();