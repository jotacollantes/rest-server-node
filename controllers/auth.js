const {response,request} = require('express')
const Usuario=require('../models/usuarios')
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
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

module.exports= {
    login
}