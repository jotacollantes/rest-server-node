const {Router} = require('express');
const { check } = require('express-validator');
const { crearProducto, productosGet, productoEspecifico, updateProducto, deleteProducto } = require('../controllers/productos');
const { esCategoriaValida, esProductoValido } = require('../helpers/db-validators');
const { validarToken, validarCampos, tieneRol } = require('../middlewares');

const router=Router();


//No se necesita validar los valores para el paginado desde y limite tienen valores por default en el controlador

router.get('/',productosGet);


//Obtener un producto por ID
router.get('/:id',[
    check('id','No es un ID valido de mongo').isMongoId(),
    check('id').custom(esProductoValido),
    validarCampos
  ] ,  productoEspecifico);



router.post('/',[
    validarToken,
    //valido que el campo nombre venga en el body del request que se envia al api
    check('nombre','El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria','ID de la categoria es obligatoria').not().isEmpty(),
    check('categoria').custom(esCategoriaValida),
    validarCampos
] ,crearProducto);

//Actualizar Categoria solo los usuarios con token valido yq que sea administrador
router.put('/:id',[
    validarToken,
    //Solo si el usuario tiene rol admin puede actualizar
    tieneRol('ADMIN_ROL'),
    check('id','No es un ID valido de mongo').isMongoId(),
    check('id').custom(esProductoValido),
    //El nombre no es obligatorio en la actualizacion
    //check('nombre','Debe de ingresar el nombre del producto que desea actualizar').not().isEmpty(),
    validarCampos
  ] ,updateProducto);


  //Eliminar Categoria (cambiar estado) solo los usuarios con token valido y con rol de ADMIN
router.delete('/:id', [
  validarToken,
  tieneRol('ADMIN_ROL'),
  check('id','No es un ID valido de mongo').isMongoId(),
  check('id').custom(esProductoValido),
  validarCampos
] ,deleteProducto)




module.exports=router;