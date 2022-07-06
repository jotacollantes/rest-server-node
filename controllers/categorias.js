const {response,request, json} = require('express');
const {Categoria} = require('../models');


//Obtener todas las categorias - paginado - total -populate


const categoriasGet = async(req, res=response) => {
    
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
    const [total,categorias]= await Promise.all([
      Categoria.count(queryStatus),
      Categoria.find(queryStatus).skip(Number(desde)).limit(Number(limite)).populate('usuario','nombre')
        ])
    
        
    res.status(200).json({
       total,  
       categorias
       
      //resp
    });

  }

//Obtener una categoria en especifica con populate
const categoriaEspecifica = async (req=request,res=response)=> {

    const idCategoria= req.params.id
    //console.log(`desde controlador ${idCategoria}`);
    const categoriaDb = await Categoria.findById(idCategoria).populate('usuario','nombre');
    //console.log(`respuesta del find ${categoriaDb}`);

    res.status(200).json({
        msg: 'Categoria Encontrada',
        categoriaDb
       //resp
     });

}

const crearCategoria= async (req=request,res=response) => {

      const nombre = req.body.nombre.toUpperCase();
      //console.log(nombre)  
      
      //Valido si ya existe la categoria
      //CategoriaDb va a tener todos los campos del resultado de la busqueda
      const categoriaDb =await Categoria.findOne({nombre});
      if(categoriaDb)
      {
        return res.status(400).json(
            {
                msg: `La categoria ${categoriaDb.nombre} ya existe`
            }
        )
      }

    //Armamos la data que vamos a guardar
    //solo mando a guardar el nombre y el usuario que lo creo porque el resto de campos tienen valores por default
      const data = {
        nombre : nombre,
        usuario: req.userauth._id
      }
    
    //Creo una instancia de Categoria con los datos configurados en data
    const categoriaSave = new Categoria(data)
    
    await categoriaSave.save();
    console.log({data});
    res.status(201).json({
        mgs: 'Categoria creada',
        categoriaSave
     })

    console.log("Desde Controlador Categorias")

} 






const updateCategoria = async (req=request, res=response) => {
  
  const {id} = req.params;
  //Excluyo los campos estado e usuario y me quedo solo con lo que hay en ...data en caso de un usuario mal intencionado que quiera probar la seguridad del backend. Puede enviar mil parametros en el request pero solo me quedo con el nombre
  const {estado,usuario, ...data} = req.body;
  console.log(`id desde el controlador ${id}`);
  console.log(`nombre desde el controlador ${data.nombre.toUpperCase()}`);
  //Tambien obtendremos el _id del usuario que hace el cambio, este dato viene del usuario autenticado  userauth
  //Añado el campo usuario al arreglo ...data
  data.usuario= req.userauth._id;
  
  try {
    //new.true muestra el nuevo documento ya con los datos actualizados
    const categoriaUpdate =await Categoria.findByIdAndUpdate(id,
      {
        nombre:data.nombre.toUpperCase(),
        usuario:data.usuario
      },{new:true})
  console.log(categoriaUpdate)
  res.status(201).json({
      msg : 'Actualizacion Correcta',
      categoriaUpdate
  })
  } catch (error) {
    res.status(401).json({
      msg : `error al actualizar categoria ${data.nombre.toUpperCase()}`,
      error
  });
  console.log(error) ;
}                                       
}

//Borrar Categoria
const deleteCategoria = async (req=request, res=response) => {
  
  const {id} = req.params;
  console.log(`id desde el controlador ${id}`);
  
  
  try
  {
    const categoriaDelete =await Categoria.findByIdAndUpdate(id,{estado:false},{new:true})
    console.log(categoriaDelete)
    res.status(201).json({
      msg : 'Eliminacion Correcta',
      categoriaDelete
      })
  } 
  catch (error)
    {
    res.status(401).json({
      msg : `error al eliminar categoria`,
      error
  });
  console.log(error) ;
    }                                       
}


module.exports= {
    categoriasGet,
    categoriaEspecifica,
    crearCategoria,
    updateCategoria,
    deleteCategoria
}