const {response,request, json} = require('express');
const {Producto} = require('../models');



const crearProducto= async (req=request,res=response) => {

    //const nombre = req.body.nombre.toUpperCase();
    //const categoria = req.body.categoria;
    //desestructuro solo para quedarme con nombre para capitalizarlo y todo lo demas en el ...body, en el body esta includio la categoria que es obigatorio y que fue validada en la ruta
    const {estado,usuario, nombre, ...body} = req.body;

    //Almaceno el id de la categoria ya validado
   
    console.log(body)  
    
    //Valido si ya existe el producto
    //productoDb va a tener todos los campos del resultado de la busqueda
    const productoDb =await Producto.findOne({nombre});
    if(productoDb)
    {
      return res.status(400).json(
          {
              msg: `El producto ${productoDb.nombre} ya existe`
          }
      )
    }

  //Armamos la data que vamos a guardar
  //solo mando a guardar el nombre y el usuario que lo creo porque el resto de campos tienen valores por default
    const data = {
      nombre : nombre.toUpperCase(),
      usuario: req.userauth._id,
      //categoria: categoria,
      //en un objeto js si hay que poner los ... de un objeto rest
      ...body
    }
  
  //Creo una instancia de producto con los datos configurados en data
  const productoSave = new Producto(data)
  
    try {
      await productoSave.save();
      //console.log({data});
      res.status(201).json({
          mgs: 'Producto creado',
          productoSave
      })

      //console.log("Desde Controlador Producto")
    } catch (error) {
      
      res.status(400).json({
          mgs: 'Error al grabar producto',
          error
      })
      console.log({error});
    }

 }
 
 //Obtener todos los productos - paginado - total -populate


const productosGet = async(req, res=response) => {
    
  //La desestructuracion te permite asignar valores predeterminados
  //const {nombre='no name',edad,apikey,page=1,limit}=req.query;
  const {limite =5,desde=0} =req.query;
  const queryStatus={estado:true};
  
  // const usuarios = await Usuario.find(queryStatus)
  // .skip(Number(desde))
  // .limit(Number(limite))
  // const total= await Usuario.count(queryStatus);

  //Esto es mucho mas rapido ya lo que esta en la lista de las Promesas se van a ejecutar en simultanio.
  //Con await por separados son bloqueantes o pausantes, la una no continua si la anterior no se resuelve.
  //Se tienen que hacer todas, una falla todo marca error
  //Desestructuro la respuesta, una variable por cada resultado
  const [total,productos]= await Promise.all([
    Producto.count(queryStatus),
    Producto.find(queryStatus).skip(Number(desde)).limit(Number(limite)).populate('usuario','nombre').populate('categoria','nombre')
      ])
  
      
  res.status(200).json({
     total,  
     productos
  });

}
 
//Obtener un Producto en especifica con populate
const productoEspecifico = async (req=request,res=response)=> {

  const idProducto= req.params.id
  console.log(`desde controlador ${idProducto}`);
  const productoDb = await Producto.findById(idProducto).populate('usuario','nombre').populate('categoria','nombre');
  console.log(`respuesta del find ${productoDb}`);

  res.status(200).json({
      msg: 'Categoria Encontrada',
      productoDb
     //resp
   });

}


const updateProducto = async (req=request, res=response) => {
  
  const {id} = req.params;
  //Excluyo los campos estado e usuario y me quedo solo con lo que hay en ...data en caso de un usuario mal intencionado que quiera probar la seguridad del backend. Puede enviar mil parametros en el request pero solo me quedo con el nombre
  const {estado,usuario, ...data} = req.body;
  //console.log(`id desde el controlador ${id}`);
  //console.log(`nombre desde el controlador ${data.nombre.toUpperCase()}`);
  console.log('Arreglo Data', data);
  //Tambien obtendremos el _id del usuario que hace el cambio, este dato viene del usuario autenticado  userauth
  //Añado el campo usuario al arreglo ...data
  data.usuario= req.userauth._id;

  //Solo si se envia el nobmbre se lo capitaliza
  // if(data.nombre){
  //   data.nombre=data.nombre.toUpperCase()
  //   console.log(data.nombre)
  // }
  
  try {
    //new.true muestra el nuevo documento ya con los datos actualizados
    const productoUpdate =await Producto.findByIdAndUpdate(id,
      {
        //Si no se envia el dato de un campo que no fue modificado dentro del body, se mantiene los datos en el registro actual
        nombre: (data.nombre) ? data.nombre.toUpperCase() : data.nombre ,
        usuario:data.usuario,
        precio:data.precio,
        descripcion:data.descripcion,
        categoria:data.categoria,
        disponible:data.disponible
      },{new:true})

  //console.log(productoUpdate)
  res.status(201).json({
      msg : 'Actualizacion de producto Correcta',
      productoUpdate
  })
  } catch (error) {
    res.status(401).json({
      msg : `error al actualizar producto ${data.nombre.toUpperCase()}`,
      error
  });
  console.log(error) ;
}                                       
}

//Borrar Producto
const deleteProducto = async (req=request, res=response) => {
  
  const {id} = req.params;
  console.log(`id desde el controlador ${id}`);
  
  
  try
  {
    const productoDelete =await Producto.findByIdAndUpdate(id,{estado:false},{new:true})
    console.log(productoDelete)
    res.status(201).json({
      msg : 'Eliminacion Correcta',
      productoDelete
      })
  } 
  catch (error)
    {
    res.status(401).json({
      msg : `error al eliminar producto con el id ${id}`,
      error
  });
  console.log(error) ;
    }                                       
}



module.exports={
    crearProducto,
    productosGet,
    productoEspecifico,
    updateProducto,
    deleteProducto
}