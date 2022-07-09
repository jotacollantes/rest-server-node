const {request,response}=require('express')
const { validationResult } = require('express-validator');

const validarCampos =(req,res, next) => {
    const errors=validationResult(req);
    // Si errors no esta vacio es porque hubo errores.
    if(!errors.isEmpty())
    {
      res.status(400).json(errors)
      return;
    }
    //SI no hay error en una validacion especifica con la funcion next se va al siguiente check dentro del middleware
    next();
}

module.exports= {
    validarCampos
    
}