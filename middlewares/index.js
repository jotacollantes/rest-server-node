
//Estas constantes tienen todo lo que exportan estos archivos
const validar_campos = require('../middlewares/validar-campos');
const validar_jwt  = require('../middlewares/validar-jwt');
const validar_roles=require('../middlewares/validar-roles')

module.exports={
    //Con el operador Spread ... Exporto todo lo que tiene las constante declaradas en la parte de arribas, que a su vez reciben todo lo que exportan los archivos que estan dentro del directorio /middleware
    ...validar_campos,
    ...validar_jwt,
    ...validar_roles
}