const {response,request, json} = require('express')
const Usuario=require('../models/usuarios')
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const login = async (req,res) =>
{
const {correo,password} = req.body;
    try {
        //Verificar si el email existe

        const usuario=await Usuario.findOne({correo : correo})
        if(!usuario) {
            return res.status(400).json({
                msg : `Usuario con le correo ${correo} no existe`
            })
        }

        //Validar usuario activo
        //Si el usuario esta en false
        if(!usuario.estado) {
            return res.status(400).json({
                msg : `Usuario con le correo ${correo} no esta activo`
            })
        }
        
        //Validar Password
        const validPassword = bcryptjs.compareSync(password,usuario.password)
        if(!validPassword) {
            return res.status(400).json({
                msg : `Contraseña es invalidad`
            })
        }



        //crear JWT
        const token = await generarJWT(usuario.id)
        


         res.json({
         msg: 'login ok',
         usuario,
         token
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador",
            error: error
        })

    }    
   

}

    const googleSignIn = async(req=request,res=response) =>{

        const {id_token}=req.body;
        //console.log(id_token);
        try {

            //Como esperamos una promesa usamos el await y eso se lo maneja con el try/catch.. el await siempre tiene que estar dentro de un contexto Async
            //const googleUser= await googleVerify(id_token);
            const {nombre,correo}= await googleVerify(id_token);
            console.log(`Desestructurado: ${nombre} ${correo}` )

            let usuario=await Usuario.findOne({correo});
            console.log(`Usuario: ${usuario}`)
            //Si el usuario no existe o es null ,lo creamos
            if(!usuario)
            {
                console.log(`Entro porque el usuario es NULL: ${usuario}`)
                //Creamos el objeto del usuario segun su definicion en el modelo
                const data= {
                    nombre : nombre,
                    correo: correo,
                    password: 'abc',
                    google:true,
                    rol:"USER_ROL"
                    
                }
                usuario =new Usuario(data);
                //console.log(`Datos del usuario despues de crear la instancia: ${usuario}`)
                await usuario.save();
            }

            //Si el usuario existe pero estado esta deshabilitado (false)
            if(!usuario.estado)
            {
               
               return res.status(401).json(
                    {
                    msg: "Hable con el administrador, usuario esta deshabilotad"
                    });
            }

             //crear JWT para ese nuevo usuario autenticado con google con el id de mongo
             const token = await generarJWT(usuario.id)




            res.json({
            msg1: "Todo bien",
            usuario,
            token
            
            });  
        } catch (error) {

            res.status(400).json(
                {
                    ok: false,
                    msg: `Error en Sign In ${error}`
                }
            )
            
        }


       
    }

module.exports= {
    login,
    googleSignIn
}