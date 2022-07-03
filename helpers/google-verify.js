const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//googleVerify es una funcion asincrinica y devolvera una promesa
//Es una funcion provista por google y hay que usarla tal cual
async function googleVerify (token='')
{
  
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const {name,email}= ticket.getPayload();
  //console.log("Payload desestructurado: ", name, email);
  //const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

    //Devuelvo un objeto de JS
  return {
    nombre: name,
    correo: email
        }

}
//verify().catch(console.error);
module.exports={
    googleVerify,
}