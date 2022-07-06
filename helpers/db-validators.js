const Role = require('../models/role');
const Usuario = require('../models/usuarios');
const Categoria = require('../models/categoria');
const {Producto}= require('../models');
const ObjectId = require('mongoose').Types.ObjectId;

const esCategoriaValida=async (categoria='')=> {
  const existeCategoria = await Categoria.findById(categoria);
  if(!existeCategoria)
  {
    //El express-validator par alanzar un error personalizado usa THROW NEW Error
    throw new Error(`La categoria con el id ${categoria} no esta registrada en la bd`)
  }
}

//Verificar si es un producto valido
const esProductoValido= async(producto) => {

  //console.log(`Desde Validator ${producto}`);
  const existeProducto=await Producto.findById(producto)
  //console.log(`Desde Validator ${existeProducto}`);
  if (!existeProducto)
  {
    //console.log(`Desde Validator: no existe ${producto}`);
  // res.status(400).json({
  //     msg: `Correo ${correo} ya esta registrado`
  // })
  //return;
      //El express-validator par alanzar un error personalizado usa THROW NEW Error
      throw new Error(`El _id ${producto} del producto no existe en la bd`)
  }
}







const esRolValido=async (rol='')=> {
    const existeRol = await Role.findOne({rol:rol});
    if(!existeRol)
    {
      //El express-validator par alanzar un error personalizado usa THROW NEW Error
      throw new Error(`El rol ${rol} no esta registrado en la bd`)

    }
  }

 //Verificar si el correo Existe
 const correoNoExiste= async(correo='') => {
    const existeEmail=await Usuario.findOne({correo : correo})
    if (existeEmail)
    {
    // res.status(400).json({
    //     msg: `Correo ${correo} ya esta registrado`
    // })
    //return;
        //El express-validator par alanzar un error personalizado usa THROW NEW Error
        throw new Error(`El correo ${correo} ya existe en la bd`)
    }
}

 

 //Verificar si Id de Mongo existe
 const idMongoNoExiste= async(id) => {
  const existeId=await Usuario.findById(id)
  if (!existeId)
  {
  // res.status(400).json({
  //     msg: `Correo ${correo} ya esta registrado`
  // })
  //return;
      //El express-validator par alanzar un error personalizado usa THROW NEW Error
      throw new Error(`El _id ${id} de usario no existe existe en la bd`)
  }
}


//Verificar si Id de Mongo existe
 const idMongoNoExisteCategoria= async(id) => {

  //console.log(id);
  const existeId=await Categoria.findById(id)
  //console.log(existeId);
  if (!existeId)
  {
  // res.status(400).json({
  //     msg: `Correo ${correo} ya esta registrado`
  // })
  //return;
      //El express-validator par alanzar un error personalizado usa THROW NEW Error
      throw new Error(`El _id ${id} de la categoria no existe existe en la bd`)
  }
}





const correoExiste= async(correo='') => {
  const existeEmail=await Usuario.findOne({correo : correo})
  //console.log(existeEmail)
  if (!existeEmail)
  {
  // res.status(400).json({
  //     msg: `Correo ${correo} ya esta registrado`
  // })
  //return;
      //El express-validator par alanzar un error personalizado usa THROW NEW Error
      throw new Error(`El correo ${correo} no existe en la bd`)
  }
}


const isValidObjectId= (termino)=>{
     
  if(ObjectId.isValid(termino)){

      const cadena =(String)(new ObjectId(termino));
      if(cadena === termino)
      {
          console.log(`desde el interrior de la funcion: true cadena ${cadena} termino ${termino}` )
          return true;
      } 
      console.log(`desde el interrior de la funcion: false cadena ${cadena} termino ${termino}` )   
      return false;
  }
  console.log('ObjectId.isValid: false', termino ) 
  return false;
}



  module.exports={
    esCategoriaValida,
    esProductoValido,
    esRolValido,
    correoNoExiste,
    idMongoNoExiste,
    idMongoNoExisteCategoria,
    correoExiste,
    isValidObjectId
    
  }