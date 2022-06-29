const {request,response}=require('express')
//Se recomienda usar la primera letra en mayuscula en el nombre de la variable
const Usuario =require('../models/usuarios');
const bcryptjs=require('bcryptjs');



const usuariosGet = async(req, res=response) => {
    //res.send('Hello World')
    //La desestructuracion te permite asignar valores predeterminados
    //const {nombre='no name',edad,apikey,page=1,limit}=req.query;
    const {limite =5,desde=0} =req.query;
    const queryStatus={estado:true};



    // const usuarios = await Usuario.find(queryStatus)
    // .skip(Number(desde))
    // .limit(Number(limite))
    // const total= await Usuario.count(queryStatus);

    //Esto es mucho mas rapido ya lo que esta en la lista de las Promesas se van a ejecutar en simultanio.
    //Con await por separados son bloqueantes o pausantes, la una no continua si la anterior no se resuelve.
    //Se tienen que hacer todas, una falla todo marca error
    //Desestructuro la respuesta, una variable por cada resultado
    const [total,usuarios]= await Promise.all([
      Usuario.count(queryStatus),
      Usuario.find(queryStatus)
      .skip(Number(desde))
     .limit(Number(limite))

    ])


    // res.json({
    //     msg : 'get Api - Controlador',
    //     nombre,
    //     edad,
    //     apikey,
    //     page,
    //     limit

    // })
    res.status(200).json({
       total,  
       usuarios
      //resp
    });

  }

  const usuariosPost = async (req, res=response) => {
    //res.send('Hello World')
  
    //const body=req.body;
    const {nombre,correo,password,rol}=req.body;
    //const usuario= new Usuario(body);
    const usuario= new Usuario({nombre,correo,password,rol});
    //Aplicar hash a la clave
    //10 es el numero de iteraciones por defecto que tendra la clave para que sea robusta
    const salt =bcryptjs.genSaltSync(10);
    //asignamos en la propiedad password de la instancia del modelo usuario, la clave encriptada.
    usuario.password=bcryptjs.hashSync(password,salt)

    //Grabar en DB
    //Grabamos en la coleccion Usuarios dentro de mongo
    try {

      await usuario.save();
      res.status(201).json({
      //msg : 'post Api - Controlador',
      //body
      usuario,
    })
    } catch (error) {
      res.status(400).json({
        //msg : 'post Api - Controlador',
        //body
        error,
        usuario,
      })
    }

    

  }
  
  const usuariosPut = async (req=request, res=response) => {
    //res.send('Hello World')
    const {id} = req.params;
    //Excluyo de la respuesta en req.body a password,google,correo y solo me quedo con el nombre y el rol en el ...resto
    const {_id,password,google,correo,...resto}=req.body;

    console.log(resto);

    //Si password tiene informacion es porque tambien lo quiere cambiar
    if (password)
    {
      const salt =bcryptjs.genSaltSync(10);
      
      //Añado el password encriptado al resto que ya es como un objeto js
      resto.password=bcryptjs.hashSync(password,salt)
      console.log(resto); 
    }

    const usuario =await Usuario.findByIdAndUpdate(id,resto)

    res.status(200).json({
        msg : 'Actualizacion Correcta',
        usuario
    })

  }

  const usuariosPatch =(req, res=response) => {
    //res.send('Hello World')
    res.json({
        msg : 'patch Api - Controlador'
    })

  }

  const usuariosDelete = async (req, res=response) => {
    //res.send('Hello World')
    const {id}=req.params;

    //Para borrarlo fisicamente
    //const usuario=await Usuario.findByIdAndDelete(id)

    //Para actualizar el estado:
    const usuario=await Usuario.findByIdAndUpdate(id,{estado:false})

    res.status(200).json({
        msg : 'Usuario eliminado',
        usuario
    })

  }

  module.exports=
  {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete

  }