const {Schema, model} = require('mongoose');

const RoleSchema= Schema({
    

    rol: {
        type: String,
        required: [true,'El rol es obligatorio']
        
    }
});
//Mongose, al momento de crear la coleccion lo va a poner en plural y en minuscula osea roles
module.exports=model('Role',RoleSchema)