const {Schema, model, SchemaTypes} = require('mongoose');

const CategoriaSchema= Schema({
    

    nombre: {
        type: String,
        required: [true,'El nombre de la categoria es obligatoria'],
        unique:true
        
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
        
    },
    //Campo de referencia con el modelo Usuario (usuarios en mongo)
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //Nombre del modelo Usuario
        required: true
    }
});

//Voy a sobre escribir el .JSON de respuesta que se envia al usuario
CategoriaSchema.methods.toJSON= function () {
    //Operador REST ...soloDatosUsuario quiere decir que va almacenar todos los campos en soloDatosUsuario menos __v y password
    //this.object hace referencia a la instancia creada de UsuarioSchema
    const { __v,...data} =this.toObject();
    return data;
}



//Mongose, al momento de crear la coleccion lo va a poner en plural y en minuscula osea  categorias
module.exports=model('Categoria',CategoriaSchema)