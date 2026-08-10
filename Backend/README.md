<h1 align="center">🇬🇧 Task List V2 (Back-End) - 🇧🇷 Lista de Tarefas V2 (Back-End)</h1>

<p align="center">
  <b>🇬🇧</b> - Welcome to the Back-End repository of Task List V2! Built with Node.js, Express, and MongoDB, this RESTful API powers the core server-side functionality for Task List V2. It handles user authentication using JWT tokens, password encryption, database interactions, and secure CRUD operations for personal tasks.
  <br/><br/>
  <b>🇧🇷</b> - Bem-vindo ao repositório Back-End do Lista de Tarefas V2! Construído com Node.js, Express e MongoDB, esta API RESTful gerencia todas as funcionalidades de servidor da V2. Ela é responsável pela autenticação de usuários via tokens JWT, criptografia de senhas, integração com o banco de dados e operações CRUD seguras de tarefas.
</p>

<h2 align="center">🇬🇧 Technologies Used - 🇧🇷 Tecnologias Utilizadas</h2>

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,js,ts&theme=dark" alt="Technologies Used" />
  </a>
</p>

<h2 align="center">🇬🇧 Key Features - 🇧🇷 Principais Funcionalidades</h2>

<ul>
  <li>
    <b>🇬🇧 RESTful Architecture:</b> Well-structured endpoints for user registration, authentication, and task operations.<br/>
    <b>🇧🇷 Arquitetura RESTful:</b> Rotas estruturadas para cadastro de usuários, login e gerenciamento de tarefas.
  </li>
  <li>
    <b>🇬🇧 Secure Authentication:</b> Password hashing and JWT (JSON Web Token) middleware validation.<br/>
    <b>🇧🇷 Autenticação Segura:</b> Criptografia de senhas e middleware para validação de tokens JWT.
  </li>
  <li>
    <b>🇬🇧 Database Persistence:</b> MongoDB connection via Mongoose for storing users and tasks in the cloud.<br/>
    <b>🇧🇷 Persistência de Dados:</b> Conexão com MongoDB via Mongoose para armazenamento seguro de dados na nuvem.
  </li>
  <li>
    <b>🇬🇧 Business Logic Enforcement:</b> Server-side limits and validation checks (e.g. maximum 10 tasks per user).<br/>
    <b>🇧🇷 Regras de Negócio:</b> Validações diretamente no servidor (ex: limite máximo de 10 tarefas por usuário).
  </li>
</ul>

<h2 align="center">🇬🇧 How to Run - 🇧🇷 Como Executar</h2>

```bash
# Clone the repository / Clone o repositório
git clone [https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git](https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git)

# Enter the directory / Entre no diretório
cd backend

# Install dependencies / Instale as dependências
npm install

# Create environment variables / Crie as variáveis de ambiente (.env)
# PORT=5000
# MONGO_URI=sua_string_de_conexao_mongodb
# JWT_SECRET=sua_chave_secreta

# Run the project / Inicie o servidor
npm run dev
```
