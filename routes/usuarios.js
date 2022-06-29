const {Router} = require('express');
const { check } = require('express-validator');
const { usuariosGet,usuariosPost,usuariosPut,usuariosDelete,usuariosPatch } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRolValido, correoNoExiste,idMongoNoExiste } = require('../helpers/db-validators');
const router=Router();

//Siempre que va algo en medio de la ruta y del controlador sera un middleware
//EL middleware puede ser un  [] arreglo de middlewares cuando son varios.

  router.get('/', usuariosGet )

  router.put('/:id',[
    check('id','No es un ID valido de mongo').isMongoId(),
    check('id').custom(idMongoNoExiste),
    check('rol').custom(esRolValido),
    validarCampos
  ] , usuariosPut)
 // Valida el campo correo del body
  router.post('/',
  [
    // SI no se cumple la condicion definida en la funcion que esta en el extremo derecho, se envia el mensaje que esta en medio del check
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El Password debe de ser minimo 8 caracteres').isLength( {min:8}),
    check('correo','El Correo no es valido').isEmail(),
    check('correo').custom(correoNoExiste),
    //check('rol','El rol no es valido').isIn('ADMIN_ROL','USER_ROL'),
    //check('rol').custom(((rol) => esRolValido(rol)),
    //Como el parametro recibido en la funcion es el mismo que se envia como parametro en la llamada a esRolValido se pued eobviar ambos parametros
    check('rol').custom(esRolValido),
    //Tengo que ejecutar validarCampos porque tengo que verificar la lista de errores para enviar al usuario, si no hay errores se ejecutara el next() y la siguiente instruccion ya es el controlador
    validarCampos
    
  ] ,usuariosPost)

  router.delete('/:id', [
    check('id','No es un ID valido de mongo').isMongoId(),
    check('id').custom(idMongoNoExiste),
    validarCampos
  ] ,usuariosDelete)

  router.patch('/', usuariosPatch )

  module.exports=router;