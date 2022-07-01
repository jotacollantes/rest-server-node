const {response,request}=require('express')
const esAdminRole = (req=request,res=response,next) => {
//Como el middleware validarToken se ejecuta primero el req ya esta configurado con la informacion del usuario autenticado.
if(!req.userauth)
{
    return res.status(500).json({
        msg:'Se quiere verificar el role sin validar el token primero'
    });
}

const {rol,nombre}=req.userauth;

if(rol !== "ADMIN_ROL")
{
    return res.status(402).json({
        msg: `Usuario ${nombre} no tiene privilegio de Adminisrador`
    });
}


next();
} 

//Normalmente una funcion de middleware siempre tiene que tener como parametro un req, res si recibe otros argumentos, dentro de la misma funcion hay que ejecutar otra funcion que ya va a tener los parametros req, res, esta funcion se tiene que devolver con return.

//Uso el Spread ... para atrapar todos los argumentos que se envien como parametros y armar un arreglo
const tieneRol = (...roles) => {
    
    console.log(roles);

    return (req,res=response,next) => 
    {
        const {rol}=req.userauth;
        //console.log(roles, rol);

        if(!req.userauth)
        {
            return res.status(500).json({
                msg:'Se quiere verificar el role sin validar el token primero'
            });
        }

        if(!roles.includes(req.userauth.rol))
        {
            return res.status(500).json({
                msg: `El servicio necesita que el usuario al menos tenga uno de los siguientes roles ${roles}`
            });
        }

        next();
    }

}
module.exports={
    esAdminRole,
    tieneRol
}