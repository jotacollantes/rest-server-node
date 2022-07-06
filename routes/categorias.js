const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, categoriasGet, categoriaEspecifica, updateCategoria, deleteCategoria } = require('../controllers/categorias');
const { validarToken,validarCampos, tieneRol } = require('../middlewares');
const { idMongoNoExisteCategoria, esRolValido } = require('../helpers/db-validators');

const router=Router();



//Obtener todas las categorias -acceso publico

//No se necesita validar los valores para el paginado desde y limite tienen valores por default en el controlador

router.get('/',categoriasGet);

//Obtener una categoria por ID
router.get('/:id',[
    check('id','No es un ID valido de mongo').isMongoId(),
    check('id').custom(idMongoNoExisteCategoria),
    validarCampos
  ] ,  categoriaEspecifica)


//Crear Categoria solo los usuarios con token valido
router.post('/',[
    validarToken,
    //valido que el campo nombre venga en el body del request que se envia al api
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,crearCategoria);

//Actualizar Categoria solo los usuarios con token valido yq que sea administrador
router.put('/:id',[
    validarToken,
    //Solo si el usuario tiene rol admin puede actualizar
    tieneRol('ADMIN_ROL'),
    check('id','No es un ID valido de mongo').isMongoId(),
    check('id').custom(idMongoNoExisteCategoria),
    //Si el nombre de la categoria no es vacio
    check('nombre','Debe de ingresar el nombre de la categoria').not().isEmpty(),
    validarCampos
  ] ,updateCategoria)

//Eliminar Categoria (cambiar estado) solo los usuarios con token valido y con rol de ADMIN
router.delete('/:id', [
    validarToken,
    tieneRol('ADMIN_ROL'),
    check('id','No es un ID valido de mongo').isMongoId(),
    check('id').custom(idMongoNoExisteCategoria),
    validarCampos
  ] ,deleteCategoria)


module.exports=router;