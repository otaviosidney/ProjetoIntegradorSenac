const {Sequelize} = require(`sequelize`)

const sequelize = new Sequelize(process.env.DATABASE_URL,{
    dialect:`mysql`,
    logging:true,
})

async function initDb(options = {alter:false}) {
    try {
        await sequelize.authenticate()
        console.log('Conectado ao MySQL')
    } catch (error) {
        console.error('Erro ao conectar ao MySQL:', err)
    }

    try {
        await sequelize.sync(options)
        console.log('Todos os modelos sincronizados')
    } catch (error) {
        console.error('Erro ao sincronizar modelos:', error)
    }
}


module.exports = {
    sequelize,
    initDb
}