const {response,request}=require('express')

const validarFile= (req=request,res=response,next)=> {
 if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
   res.status(400).json( {msg: 'No files were uploaded. Desde Middleware'});
    return;
    }
next();
}

module.exports={
    validarFile
}