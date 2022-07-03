const {Router} = require('express');
const { login,googleSignIn } = require('../controllers/auth');
const { check } = require('express-validator');
const { esRolValido, correoExiste,idMongoNoExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const router=Router();

//para la ruta /login y metodo post llamo al controlador login que esta en /controllers/auth
router.post('/login',[
check('correo','El Correo es obligatorio').isEmail(),
check('password','La contraseña es obligatoria').not().isEmpty(),
//check('correo').custom(correoExiste),
validarCampos
],login)

//para la ruta /login y metodo post llamo al controlador login que esta en /controllers/auth
router.post('/google',[
    check('id_token','Google Id Token es obligatorio').not().isEmpty(),
    validarCampos
    ],googleSignIn)
module.exports=router;