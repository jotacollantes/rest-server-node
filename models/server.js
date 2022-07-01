const express = require('express')
const cors =require('cors')
const {dbConnection}=require('../database/config');
class Server {
    
    constructor() {
        this.app = express()
        this.port=process.env.PORT
        //Creamos los path para el crud de usuarios y para la autenticacion
        this.usuariosPath='/api/usuarios';
        this.authPath='/api/auth';


        //Conexcion a bd
        this.conectarDb();
        //Middlewares
        this.middlewares();
       
        //Rutas de mi aplicacion

        this.routes();
        
    }


    // Tambien se puede usar async/await
    async conectarDb()
    {
        try {
            console.log('Conectando...')
            await dbConnection();
            console.clear();
            console.log('Conectado!!!')

        } catch (error) {
            console.log(error)
        }
        
    }

    middlewares(){
        //Aqui se configuran los middlewares
        //Directorio Publico
        //Aqui se publicara el index.html que esta en la carpeta publica.
        this.app.use(express.static('public'));
        //Cors para controlar los accesos

        this.app.use(cors());
        // Lectura y parseo del body
        this.app.use(express.json());
    }
    routes()
    {
          //Creamos las rutas  para el crud de usuarios y para la autenticacion haciendo sus respectivos requires
          this.app.use(this.authPath,require('../routes/auth'))   
          this.app.use(this.usuariosPath,require('../routes/usuarios'))

    }

    listen()
    {
        this.app.listen(this.port,() => {
        console.log(`Corriendo en puerto: ${this.port}`)
    })}
}
module.exports=Server;