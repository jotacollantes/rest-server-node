const {response,request, json} = require('express');
const { isValidObjectId } = require('../helpers/db-validators');
const { Usuario,Categoria,Producto } = require('../models');
//esta importacion me sirve para poder verificar si el valor o termino qu em eenvian en el params es de tipoo _id Object de mongo
//const {ObjectId}=require('mongoose').Types; NO FUNCIONA hay que hacer funcion adicional


const coleccionesPermitidas=[
    'usuarios',
    'categorias',
    'productos',
    'roles'
]




const buscarUsuarios=async (termino='',res=response) =>{

    //SI el termino es un mongoID
   
    //const esMongoId=ObjectId.isValid(termino)// true
    const esMongoId=isValidObjectId(termino)
    if (esMongoId){
        console.log('entro');
        const usuario= await Usuario.findById(termino);
        return res.status(200).json({
            //EN lugrar de enviar [null] envio un arreglo vacio []
            results: (usuario) ? [usuario] :[]
        });
    }
    //COn esta expresion regular haga insensible a Mayuscula o minuscula y mostrara todas las coincidencias que incluyan lo que envio como termino de busqueda
    const regex = new RegExp(termino,'i');
    
    const total = await Usuario.count({
        //Si el termino no lo encuentra en el nombre, que lo busque en el correo
        //$or es un comando de mongo
        $or:[{nombre: regex},{correo: regex}],
        $and:[{estado: true}]
        
    });

    const usuarios = await Usuario.find({
        //Si el termino no lo encuentra en el nombre, que lo busque en el correo
        //$or es un comando de mongo
        $or:[{nombre: regex},{correo: regex}],
        $and:[{estado: true}]
        
    });


    res.status(200).json({
        total :  total,
        results: usuarios
    });

}







const buscarCategorias=async (termino='',res=response) =>{

    //SI el termino es un mongoID
    //const esMongoId=ObjectId.isValid(termino);// true
    const esMongoId=isValidObjectId(termino)
    
    console.log('esMongoId: ',esMongoId);
    if (esMongoId){
        console.log('entro:', termino, esMongoId);
        const categoria= await Categoria.findById(termino);
        return res.status(200).json({
            //EN lugrar de enviar [null] envio un arreglo vacio []
            results: (categoria) ? [categoria] :[]
        });
    }
    //COn esta expresion regular haga insensible a Mayuscula o minuscula y mostrara todas las coincidencias que incluyan lo que envio como termino de busqueda
    const regex = new RegExp(termino,'i');
    
    const total = await Categoria.count({
        //Si el termino no lo encuentra en el nombre, que lo busque en el correo
        //$and es un comando de mongo
        $and:[{nombre: regex},{estado: true}]
        
        
    });

    console.log('total categorias', total)

    const categorias = await Categoria.find({
        //Si el termino no lo encuentra en el nombre, que lo busque en el correo
        //$and es un comando de mongo
        $and:[{nombre: regex},{estado: true}]
        
    });


    res.status(200).json({
        total :  total,
        results: categorias
    });

}




const buscarProductos=async (termino='',res=response) =>{

    //SI el termino es un mongoID
    //const esMongoId=ObjectId.isValid(termino);// true
    const esMongoId=isValidObjectId(termino)
    
    console.log('esMongoId: ',esMongoId);
    if (esMongoId){
        console.log('entro:', termino, esMongoId);
        const producto= await Producto.findById(termino).populate('categoria','nombre');
        return res.status(200).json({
            //EN lugrar de enviar [null] envio un arreglo vacio []
            results: (producto) ? [producto] :[]
        });
    }
    //COn esta expresion regular haga insensible a Mayuscula o minuscula y mostrara todas las coincidencias que incluyan lo que envio como termino de busqueda
    const regex = new RegExp(termino,'i');
    
    const total = await Producto.count({
        //Si el termino no lo encuentra en el nombre, que lo busque en el correo
        //$and es un comando de mongo
        $and:[{nombre: regex},{estado: true}]
        
        
    });

    console.log('total Productos', total)

    const productos = await Producto.find({
        //Si el termino no lo encuentra en el nombre, que lo busque en el correo
        //$and es un comando de mongo
        $and:[{nombre: regex},{estado: true}]
        
    }).populate('categoria','nombre');


    res.status(200).json({
        total :  total,
        results: productos
    });

}



const buscar = (req=request,res=response)=> {
    const {coleccion,termino}=req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `La collecion ${coleccion} no es valida. Colecciones permitidas ${coleccionesPermitidas}`
        })
    }     
   //Los valores de la coleccion a buscar enstan en el param collecion
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res)
            break;
        case 'categorias':
            buscarCategorias(termino,res)
            break;
        
        case 'productos':
            buscarProductos(termino,res)
            break;      
    
        default:
            return res.status(500).json({
                msg: `falta una busqueda por hacer`
            })
    }

    // res.status(200).json({
    //     msg: `desde busqueda ${coleccion} / ${termino} `
    // })

}

module.exports={
buscar
}