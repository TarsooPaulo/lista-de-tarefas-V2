const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true, // Garante que não haverá nomes de usuário duplicados
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);