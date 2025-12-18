require('dotenv').config()
require('./config/verifyEnv').verifyEnv()
const path = require('path');
const express = require("express")
const session = require("express-session")
const flash = require('connect-flash');
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const { initDb } = require('./config/database');
const onlyAuth = require('./middlewares/onlyAuth');
const loadCurrentUser = require('./middlewares/loadCurrentUser');
const setGlobalVars = require('./middlewares/setGlobalVars');
const handleException = require('./middlewares/handleException');
const handle404 = require('./middlewares/handle404');

const PORT = process.env.SERVER_PORT | 3000
const server = express()

const configSession = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}

server.use(session(configSession))
server.set("view engine", "ejs")
server.set('views', path.join(__dirname, 'views'))
server.use(express.static(path.join(__dirname, 'public')))
server.use(express.static(path.join(__dirname, 'uploads')))
server.use(express.urlencoded({ extended: true }))
server.use(flash())
server.use(loadCurrentUser)
server.use(setGlobalVars);


server.use('/auth',authRoutes)
server.use('/',onlyAuth,userRoutes)
server.use(handleException)
server.use(handle404);

async function initServer(){
    await initDb({alter:false})
    server.listen({port:PORT}, () => {
        console.log(`Server listen on ${PORT}`)
    })
}

initServer()