const mongoose = require('mongoose')
const dbConnection = async() => {
    try {
        //como connect devuelve una promesa hay que manejar try/catch
        await mongoose.connect(process.env.MONGO_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            //useFindAndModify: false

        })
        console.log('Base de datos Conectadas');
    } catch (error) {
        console.log(error)
        throw new Error('Error en conexion de base de datos');
        
    }
}

module.exports ={
    dbConnection

}