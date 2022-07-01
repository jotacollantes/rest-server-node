const jwt=require('jsonwebtoken')
const {response,request}=require('express')
const Usuario =require('../models/usuarios')

const validarToken= async (req=request,res=response,next)=> {
    const token = req.header('x-token');
    //console.log(token);
    if (!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }
    

    try {
        const {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY)
        //console.log(payload);
        //Creamos una propiedad nueva dentro del objeto req (request) que se maneja por referencia o sea el objeto req es el mismo en todos lados
        req.uid=uid

        const userAuth = await Usuario.findById(uid);


         //Verificar si el usuario existe en BD
         if(!userAuth)
         {
             return res.status(401).json({
                 msg:'Usuario no existe en BD'
             })
         }


        //Verificar si el estado el usuario autenticado es TRUE
        if(!userAuth.estado)
        {
            return res.status(401).json({
                msg:'Usuario Autenticado no esta habilitado'
            })
        }

        req.userauth=userAuth;
        next();

    } 
    // el jwt.verify en caso de error dispara un throw new Error que hay que capturarlo con catch. Siempre los throw new Error hay que capturarlos  con catch

    catch (error) {

        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })
        
    }
}

module.exports={
    validarToken
}