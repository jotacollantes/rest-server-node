const Role = require('../models/role');
const esRolValido = async (rol='')=> {
    const existeRol = await Role.findOne({rol:rol});
    if(!existeRol)
    {
      //El express-validator par alanzar un error personalizado usa THROW NEW Error
      throw new Error(`El rol ${rol} no esta registrado en la bd`)

    }
  }

  module.exports={
    esRolValido
  }