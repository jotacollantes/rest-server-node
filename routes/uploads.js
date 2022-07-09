const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, categoriasGet, categoriaEspecifica, updateCategoria, deleteCategoria } = require('../controllers/categorias');
const { validarToken,validarCampos, tieneRol, validarFile} = require('../middlewares');
const { idMongoNoExisteCategoria, esRolValido, esColeccionValida, idMongoNoExiste, idUsuarioExiste} = require('../helpers/db-validators');
const { uploadFiles, updateFiles, mostrarImagen, updateFilesCloudinary } = require('../controllers/uploads');

const router=Router();



//Obtener todas las categorias -acceso publico

//No se necesita validar los valores para el paginado desde y limite tienen valores por default en el controlador



//Crear Categoria solo los usuarios con token valido
//SOlo se usa un middleware sin el CHECK() por eso no se necesita al middleware validarCampos
router.post('/', [validarFile],uploadFiles);

router.put('/:coleccion/:id',[
    check('id','No es un ID valido de mongo').isMongoId(),
    //custom recibe un callback que recibe como parametro la coleccion que envia el usuario.
    check('coleccion').custom( (col) => esColeccionValida(col,['usuarios','productos'])),
    validarFile,
    validarCampos], updateFilesCloudinary);
    



router.get('/:coleccion/:id',[
    check('id','No es un ID valido de mongo').isMongoId(),
    //custom recibe un callback que recibe como parametro la coleccion que envia el usuario.
    check('coleccion').custom( (col) => esColeccionValida(col,['usuarios','productos'])),
    validarCampos], 
    mostrarImagen);

module.exports=router;