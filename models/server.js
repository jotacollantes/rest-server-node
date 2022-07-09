const express = require('express')
const cors =require('cors')
const {dbConnection}=require('../database/config');
const fileUpload = require('express-fileupload');
class Server {
    
    constructor() {
        this.app = express()
        this.port=process.env.PORT
        //Creamos los path para el crud de usuarios y para la autenticacion


        // this.usuariosPath='/api/usuarios';
        // this.authPath='/api/auth';
        //Mejor defino un objeto de JS para los paths
        this.appPaths={
            auth: '/api/auth',
            buscar: '/api/buscar',
            usuarios:'/api/usuarios',
            categorias:'/api/categorias',
            productos:'/api/productos',
            uploads:'/api/uploads',
        }

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

    //Estos middlewares se ejecutan antes de llegar a las rutas
    middlewares(){
        //Aqui se configuran los middlewares
        //Directorio Publico
        //Aqui se publicara el index.html que esta en la carpeta publica.
        this.app.use(express.static('public'));
        //Cors para controlar los accesos

        this.app.use(cors());
        // Lectura y parseo del body
        this.app.use(express.json());

        // Note that this option available for versions 1.0.0 and newer. 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            //Para añadir carpetas
            createParentPath: true}));
            
    }
    routes()
    {
          //Creamos las rutas  para el crud de usuarios y para la autenticacion haciendo sus respectivos requires
          this.app.use(this.appPaths.auth,require('../routes/auth')) 
          this.app.use(this.appPaths.buscar,require('../routes/buscar'))   
          this.app.use(this.appPaths.usuarios,require('../routes/usuarios'))
          this.app.use(this.appPaths.categorias,require('../routes/categorias'))
          this.app.use(this.appPaths.productos,require('../routes/productos'))
          this.app.use(this.appPaths.uploads,require('../routes/uploads'))
    }

    listen()
    {
        this.app.listen(this.port,() => {
        console.log(`Corriendo en puerto: ${this.port}`)
    })}
}
module.exports=Server;