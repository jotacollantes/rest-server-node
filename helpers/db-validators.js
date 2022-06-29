const Role = require('../models/role');
const Usuario = require('../models/usuarios');

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
      throw new Error(`El _id ${id} no existe existe en la bd`)
  }
}




  module.exports={
    esRolValido,
    correoNoExiste,
    idMongoNoExiste
  }