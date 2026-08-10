# 📝 Lista de Tarefas V2

Bem-vindo ao **Lista de Tarefas V2**, uma aplicação _full-stack_ desenvolvida para maximizar a produtividade através de uma interface moderna e minimalista. Este projeto marca a evolução de um hobby para uma solução funcional, com persistência de dados real e autenticação segura.

## 🚀 Sobre o Projeto

A V2 é uma versão completamente aprimorada. O objetivo principal foi elevar a experiência do usuário e garantir a segurança dos dados, permitindo que o acesso às tarefas seja feito de qualquer lugar, de forma autenticada. Diferente da versão anterior, que salvava dados apenas no navegador, agora a aplicação conecta-se a um banco de dados real em nuvem.

### 🛠️ Tecnologias Utilizadas

- **Front-end:** React, TypeScript, Tailwind CSS, Lucide React.
- **Back-end:** Node.js, Express.
- **Banco de Dados:** MongoDB.
- **Notificações:** React Toastify.
- **Deploy:** Netlify (Front-end) & Render (Back-end).

## ✨ Principais Funcionalidades

- **Autenticação Segura:** Sistema de cadastro e login de usuários com criptografia, garantindo que suas tarefas fiquem salvas na nuvem e vinculadas à sua conta.
- **Gestão de Tarefas (CRUD):** Adicione, edite em tempo real, visualize e exclua suas tarefas de forma fluida.
- **Interface Moderna:** Design minimalista e responsivo, unificando a identidade visual entre a tela de login e o painel de tarefas.
- **Feedback em Tempo Real:** Sistema de notificações inteligente (React Toastify) que informa o sucesso, erros ou avisos importantes em cada ação executada.
- **Limitação Inteligente:** Limite máximo de 10 tarefas por conta para priorizar o foco e a organização do usuário, com bloqueio visual dinâmico do input.

## 🎨 Preview

_(Insira aqui os prints do seu projeto ou GIFs demonstrando a aplicação em funcionamento)_

## 🚀 Como Executar o Projeto Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) e o [Git](https://git-scm.com/) instalados em sua máquina.

### 1. Clonar o repositório

```bash
git clone https://github.com/TarsooPaulo/lista-de-tarefas-V2.git
cd lista-de-tarefas-V2
```

### 2. Configurar e Executar o Back-end

Navegue até a pasta do servidor:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis de ambiente:

```env
PORT=5000
MONGO_URI=sua_uri_do_mongodb
JWT_SECRET=sua_chave_secreta_jwt
```

Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará rodando no endereço `http://localhost:5000`.

### 3. Configurar e Executar o Front-end

Em um novo terminal, acesse a pasta da interface:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento do front-end:

```bash
npm run start
```

Acesse a aplicação no navegador através do endereço indicado no terminal (geralmente `http://localhost:3000`).

---

## ✒️ Autor

Desenvolvido por **Paulo de Tarso Ferreira da Silva**.
