const {Schema, model} = require('mongoose');

const UsuarioSchema= Schema({
    nombre :{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo :{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password :{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    img :{
        type: String
       
    },

    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE','USER_ROLE']
    },
    estado :{
        type: Boolean,
        default: true
    },

    google :{
        type: Boolean,
        default: false
    }
});
//Puedo crear metodos despues de la definicion del esquema en el modelo

//Voy a sobre escribir el .JSON de respuesta que se envia al usuario
UsuarioSchema.methods.toJSON= function () {
    //Operador REST ...soloDatosUsuario quiere decir que va almacenar todos los campos en soloDatosUsuario menos __v y password
    //this.object hace referencia a la instancia creada de UsuarioSchema
    const { __v,password, ...soloDatosUsuario} =this.toObject();
    return soloDatosUsuario;
}
//Mongose, al momento de crear la coleccion lo va a poner en plura y en minuscula o sea usuarios  en mongoDB
module.exports=model('Usuario',UsuarioSchema)