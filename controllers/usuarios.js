const {request,response}=require('express')


const usuariosGet =(req, res=response) => {
    //res.send('Hello World')
    //La desestructuracion te permite asignar valores predeterminados
    const {nombre='no name',edad,apikey,page=1,limit}=req.query;
    res.json({
        msg : 'get Api - Controlador',
        nombre,
        edad,
        apikey,
        page,
        limit

    })

  }

  const usuariosPost =(req, res=response) => {
    //res.send('Hello World')
    //const body=req.body;
    const {nombre,edad}=req.body;
    res.status(201).json({
        msg : 'post Api - Controlador',
        //body
        nombre,
        edad
    })

  }
  
  const usuariosPut =(req=request, res=response) => {
    //res.send('Hello World')
    const {id} = req.params;
    res.json({
        msg : 'put Api - Controlador',
        id
    })

  }

  const usuariosPatch =(req, res=response) => {
    //res.send('Hello World')
    res.json({
        msg : 'patch Api - Controlador'
    })

  }

  const usuariosDelete =(req, res=response) => {
    //res.send('Hello World')
    res.json({
        msg : 'delete Api - Controlador'
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