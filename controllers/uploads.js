const path=require('path')
const fs=require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const {request,response} =require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
//tiene index
const {Usuario,Producto}=require('../models');

//uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const uploadFiles = async (req=request,res=response)=> {
    


    try {
        //subir archivos recibe 3 parametros: files=req.files, extensiones que ya tiene un arreglo con valores por default y la carpeta que si no se indica nombre de carpeta el default sera un valor vacio lo que significa que la carpeta uploads/ sera la raiz de ese archivo
         const fileName= await subirArchivo(req.files,undefined,'images');
         res.status(201).json(
            {
                msg: `Archivo subido ${fileName}`,
            });
    } catch (error) {
        res.status(400).json(
        {msg: 'No files were uploaded. Desde Controlador',
        error
        });
    }
  
}

const updateFiles= async (req=request,res=response) => 
{
    
    const {coleccion,id,} =req.params;
    let modelo;
    switch (coleccion)
    {
        case 'usuarios':
            modelo= await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json(
                    {
                        msg : `No existe usuario con el ${id}`
                    }
                )
            }
            
            break;
        case 'productos':
            modelo= await Producto.findById(id)
            if(!modelo){
                return res.status(400).json(
                    {
                        msg : `No existe el producto con el ${id}`
                    }
                )
            }
                break;
        default:
            return res.status(500).json(
                {
                    msg : `Se me olvido validar esto`
                }
            )
            
    }
    //Para Borrar Imagenes del servidor
    //Si la collecion tiene datos en el campo img
    if(modelo.img)
    {
        //console.log('Entro porque tiene imagen ');
        const pathImagen= path.join(__dirname,'../uploads',coleccion,modelo.img)
        console.log(pathImagen)
        //Pregunto si el archivo existe
        if(fs.existsSync(pathImagen))
        {   
            //SI el archivo existe se elimina.
            fs.unlinkSync(pathImagen);
        }
    }
     
    try {
        
        //Como la muncion subirArchivo devuelve una promesa, tenemos que usar try/catch para poder manejar (resolv,reject)   
        modelo.img= await subirArchivo(req.files,undefined,coleccion);
        await modelo.save();
        res.status(200).json({
        id,
        coleccion,
        modelo
    })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}


const updateFilesCloudinary= async (req=request,res=response) => 
{
    
    const {coleccion,id,} =req.params;
    let modelo;
    switch (coleccion)
    {
        case 'usuarios':
            modelo= await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json(
                    {
                        msg : `No existe usuario con el ${id}`
                    }
                )
            }
            
            break;
        case 'productos':
            modelo= await Producto.findById(id)
            if(!modelo){
                return res.status(400).json(
                    {
                        msg : `No existe el producto con el ${id}`
                    }
                )
            }
                break;
        default:
            return res.status(500).json(
                {
                    msg : `Se me olvido validar esto`
                }
            )
            
    }
    //Para Borrar Imagenes del servidor
    //Si la collecion tiene datos en el campo img
    if(modelo.img)
    {
        const nombreArr= modelo.img.split('/');
        const nombre=nombreArr[nombreArr.length-1];
        const Imagen=nombre.split('.');
        const nombreImagen=Imagen[0];
        //console.log(nombreImagen)
        //Se puede usar sin await para que se ejecute aparte y continue la ejecucion del programa
        cloudinary.uploader.destroy(nombreImagen);
    }
        const {tempFilePath}=req.files.archivo
        //console.log(tempFilePath)
        try {
        //SOlo sacamos el secure_url de la respuesta de cloudinary
        const {secure_url}= await cloudinary.uploader.upload(tempFilePath);
        
        modelo.img= secure_url;
        await modelo.save();
        res.status(200).json({modelo})
        } 
        catch (error)
        {
        res.status(400).json({
            error
        })
        }
    
     
    
}


const mostrarImagen=async (req=request,res=response)=> {
    const {id,coleccion}=req.params;
    let modelo;
    switch (coleccion)
    {
        case 'usuarios':
            modelo= await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json(
                    {
                        msg : `No existe usuario con el ${id}`
                    }
                )
            }
            
            break;
        case 'productos':
            modelo= await Producto.findById(id)
            if(!modelo){
                return res.status(400).json(
                    {
                        msg : `No existe el producto con el ${id}`
                    }
                )
            }
                break;
        default:
            return res.status(500).json(
                {
                    msg : `Se me olvido validar esto`
                }
            )
            
    }
    
    let pathImagen;
    //Si la collecion tiene datos en el campo img
    if(modelo.img)
    {
        //console.log('Entro porque tiene imagen ');
        pathImagen= path.join(__dirname,'../uploads',coleccion,modelo.img)
        console.log(pathImagen)
        //Pregunto si el archivo existe
        if(fs.existsSync(pathImagen))
        {   
            //SI el archivo existe envio la imagen
            return res.sendFile(pathImagen);
        }
    }else{

        // res.status(200).json({
        // msg: 'Falta el place Holder'
        // })
        pathImagen= path.join(__dirname,'../assets/no-image.jpg')
        return res.sendFile(pathImagen);
    }

     
    
}

module.exports={
    uploadFiles,
    updateFiles,
    mostrarImagen,
    updateFilesCloudinary

}