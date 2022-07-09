const path =require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo =(files,extensionesValidas= ['png','jpg','jpeg','gif','pdf','JPEG'],carpeta='') =>{

    //Vamos a retornar una promesa

    return new Promise((resolve,reject) => {
            const {archivo} = files;
            //archivo ya tiene la propiedad namedel req.files
            const nombreCortado = archivo.name.split('.')
            //restamos el total de elementos del arreglo menos 1 para quedarnos con el indice del ultimo elemento
            const extension=nombreCortado[nombreCortado.length -1];
            //console.log('Arreglo resultado del split', nombreCortado, 'final del arreglo ',extension)

            //Validar extensiones

            
            if (!extensionesValidas.includes(extension)){
                // return res.status(400).json({
                //     msg: `Extension ${extension} no es permitida, ${extensionesValidas}`
                //     });
                return reject(`Extension ${extension} no es permitida, ${extensionesValidas}`)
            }

            //res.json({msg: archivo.name +' Cargado'})


            //Para unir los distintos paths
            const nombreTemp=uuidv4() +'.'+extension;
            // Nonbre anterior archivo.name
            const uploadPath = path.join(__dirname,'/../uploads/',carpeta,nombreTemp);

            console.log ("Path: "+__dirname+'/../uploads/'+carpeta+'/'+nombreTemp)

            archivo.mv(uploadPath, (err) =>
            {
                if (err) {
                // return res.status(500).json({
                //     msg: "Error al mover el archivo",
                //     descripcion: err
                //     });
                reject(err)
                }

                // res.status(201).json({
                //     msg1: 'File uploaded to ' + uploadPath,
                //     msg2: msgFromPostman
                // });
                //La promesa va a devolver el nombre del archivo en lugar del todo el path
                resolve(nombreTemp)

            });
                })


}
module.exports={
    subirArchivo
}