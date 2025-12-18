🟦 **Como iniciar o projeto Mercado Business**

Segue o passo a passo para rodar o projeto na sua máquina:

**1️⃣ Instale as dependências**  
Abra o terminal na pasta do projeto e rode:

```bash
npm install
```

**2️⃣ Configure as variáveis de ambiente**  
Crie um arquivo `.env` na raiz e preencha com as configs de banco, porta, sessão etc.

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