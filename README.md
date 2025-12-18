**Mercado Business 🚀**
=======================

Uma plataforma web moderna que conecta profissionais a oportunidades de trabalho, construída com **Node.js**, **Express** e **Sequelize**.

* * *

📋 **Sobre o Projeto**
----------------------

**Mercado Business** é um marketplace profissional que permite:

* 👤 Criar perfis profissionais detalhados
    
* 🔍 Descobrir e conectar com outros profissionais
    
* 📝 Compartilhar postagens usando editor de texto rico
    
* 🎯 Selecionar áreas de atuação (Contabilidade, Marketing Digital, Coaching, Reformas)
    
* 💼 Gerenciar habilidades e competências
    

É uma plataforma completa para profissionais divulgarem seus serviços e construírem sua presença digital.

* * *

🛠️ **Tecnologias Utilizadas**
------------------------------

### **Backend**

* Node.js
    
* Express.js
    
* Sequelize (MySQL)
    
* MySQL
    
* bcrypt
    
* express-validator
    
* Multer (upload de arquivos)
    
* Express Session
    
* Connect Flash
    

### **Frontend**

* EJS
    
* Bootstrap 5
    
* Bootstrap Icons
    
* Quill.js
    
* HTML5 & CSS3
    

### **DevOps**

* Docker & Docker Compose
    
* Nodemon (ambiente de desenvolvimento)
    

* * *

📦 **Instalação**
-----------------

### **Pré-requisitos**

* Node.js 14+
    
* MySQL (ou Docker)
    
* Docker e Docker Compose (opcional)
    

* * *

**1️⃣ Instale as dependências**  
Abra o terminal na pasta do projeto e rode:

```bash
npm install
```

**2️⃣ Configure as variáveis de ambiente**  
Edite o arquivo `.env` na raiz e preencha com as configs de banco, porta, sessão etc.

**3️⃣ Suba o MySQL**  
Você pode usar Docker:

```bash
docker compose up -d
```

Ou usar um MySQL já instalado na sua máquina.

**4️⃣ Sincronize as tabelas**  
Abra o arquivo `server.js` e altere:

```js
initDb({ alter: false })
```

para

```js
initDb({ alter: true })
```

Depois salve o arquivo.

**5️⃣ Rode o servidor**  
Use:

```bash
npm run dev
```

ou

```bash
node server.js
```

⚠️ **Depois que as tabelas sincronizarem**, volte no `server.js` e coloque novamente:

```js
initDb({ alter: false })
```

🎉 **Pronto! O projeto já está funcionando em:**  
[http://localhost:3000](http://localhost:3000)

* * *

📁 **Estrutura do Projeto**
---------------------------

O projeto segue uma arquitetura MVC simples com:

* `models/` → Modelos Sequelize
    
* `controllers/` → Regras de negócios
    
* `routes/` → Rotas Express
    
* `views/` → Templates EJS
    
* `middlewares/` → Autenticação, validação e tratamento
    
* `public/` → Arquivos estáticos (CSS, JS, imagens)
    

* * *

🔐 **Funcionalidades Principais**
---------------------------------

### **Autenticação**

* Registro em 3 etapas
    
* Login com bcrypt
    
* Autenticação por sessão
    
* Logout
    
* Recuperação de sessão
    

### **Perfil do Usuário**

* Informações pessoais (nome, data de nascimento, endereço)
    
* Foto de perfil (upload)
    
* Área de atuação
    
* Email e telefone
    
* Até 5 habilidades por usuário
    
* Edição de perfil completa
    

### **Postagens**

* Criar postagens com Quill
    
* Editar postagens próprias
    
* Deletar postagens
    
* Visualizar cronograma
    

### **Descoberta de Profissionais**

* Lista de todos os usuários cadastrados
    
* Busca inteligente por:
    
    * Nome
        
    * Área de atuação
        
    * Habilidades
        
* Perfis públicos
    
* Paginação
    

* * *

🔑 **Áreas de Atuação Suportadas**
----------------------------------

* 📊 Contabilidade
    
* 📱 Marketing Digital
    
* 👥 Coaching
    
* 🔨 Reformas
    

* * *

✅ **Validações**
----------------

Validação rigorosa utilizando **express-validator**:

* **Username**: 3–20 caracteres, único
    
* **Senha**: mínimo 8 caracteres + regras de complexidade
    
* **Email**: formato válido + único
    
* **Telefone**: padrão brasileiro
    
* **Foto de perfil**: JPG, PNG ou WEBP (máx. 5MB)
    
* **Habilidades**: 3–50 caracteres
    

* * *

🗄️ **Modelos de Dados**
------------------------

* **User**
    
* **Post**
    
* **UserSkills**
    

* * *

🎨 **Design & UI**
------------------

* Cores principais:
    
    * Azul escuro: `#1e3c72`
        
    * Azul claro: `#2a5298`
        
* Estilização com Bootstrap 5
    
* Responsividade mobile-first
    
* Uso de cards, modais e componentes visuais modernos
    

* * *

🔄 **Fluxo de Registro**
------------------------

1. **Etapa 1:** Nome completo, data de nascimento, endereço
    
2. **Etapa 2:** Seleção da área de atuação
    
3. **Etapa 3:** Foto de perfil, telefone e email
    
4. Perfil finalizado e pronto para uso
    

* * *


📝 **Exemplo de Uso**
---------------------

### Criar uma conta

* Acesse `/auth/register`
    
* Preencha username e senha
    
* Complete as etapas do perfil
    
* Faça login
    

### Buscar profissionais

* Acesse `/users`
    
* Pesquise por nome, área ou habilidade
    
* Acesse o perfil público
    

### Criar uma postagem

* Entre no seu perfil
    
* Clique em _Nova Postagem_
    
* Produza o conteúdo com o editor Quill
    

* * *

🐛 **Tratamento de Erros**
--------------------------

O sistema inclui:

* Página 404
    
* Página 500
    
* Mensagens de validação personalizadas
    
* Flash messages para feedback
    

* * *

📊 **Banco de Dados**
---------------------

O sistema utiliza MySQL com Sequelize.  
As tabelas são sincronizadas automaticamente e respeitam constraints e relacionamentos.

* * *
