/**
 * FÉNIX STREAM WORKER V1
 * Token + sesiones + reproducción
 */

const SECRET = "FenixTV_2026_Segura_9981";


// Contenido de prueba
const VIDEOS = {

  pelicula1:{
    title:"Película Demo",
    duration:8100,
    url:
    "https://hugh.cdn.rumble.cloud/video/fwe2/74/s8/2/w/W/I/Y/wWIYA.aaa.mkv"
  }

};


// Sesiones temporales
const sessions = new Map();



/*
 Crear firma HMAC
*/
async function sign(data){

const key =
await crypto.subtle.importKey(
"raw",
new TextEncoder().encode(SECRET),
{
 name:"HMAC",
 hash:"SHA-256"
},
false,
["sign"]
);


const signature =
await crypto.subtle.sign(
"HMAC",
key,
new TextEncoder().encode(data)
);


return btoa(
String.fromCharCode(
...new Uint8Array(signature)
));

}



/*
 Crear token
*/
async function createToken(session){


const exp =
Math.floor(Date.now()/1000)
+
(session.duration + 1800);


const payload =
`${session.id}.${session.content}.${exp}`;


const signature =
await sign(payload);


return btoa(
payload+"."+signature
);


}



/*
 Validar token
*/
function decodeToken(token){


try{

const raw =
atob(token);


const parts =
raw.split(".");


return {

id:parts[0],
content:parts[1],
exp:Number(parts[2])

};


}catch{

return null;

}

}





export default {


async fetch(request){


const url =
new URL(request.url);



/*
 INICIAR REPRODUCCIÓN

/play/start?id=pelicula1
&user=1
&device=roku01

*/

if(url.pathname==="/play/start"){


const content =
url.searchParams.get("id");


const user =
url.searchParams.get("user");


const device =
url.searchParams.get("device");



if(!VIDEOS[content])
return new Response(
"Contenido no existe",
{status:404}
);



const sessionId =
crypto.randomUUID();



const session={

id:sessionId,

user,

device,

content,

position:0,

duration:
VIDEOS[content].duration,

created:
Date.now()

};



const token =
await createToken(session);



session.token=token;



sessions.set(
sessionId,
session
);



return Response.json({

session:sessionId,

stream:

`${url.origin}/play/video?session=${sessionId}&token=${encodeURIComponent(token)}`,

resume:0

});


}





/*
 REPRODUCIR VIDEO

*/

if(url.pathname==="/play/video"){


const sessionId =
url.searchParams.get("session");


const token =
url.searchParams.get("token");



const data =
decodeToken(token);



if(!data)
return new Response(
"Token inválido",
{status:403}
);



if(Date.now()/1000 > data.exp)
return new Response(
"Token expirado",
{status:403}
);



const session =
sessions.get(sessionId);



if(!session)
return new Response(
"Sesión no encontrada",
{status:404}
);



const video =
VIDEOS[session.content];



return fetch(
video.url,
{

headers:{

"Range":
request.headers.get("Range")
||
""

}

});


}





/*
 GUARDAR POSICIÓN

/play/save

*/

if(url.pathname==="/play/save"){


const body =
await request.json();


const session =
sessions.get(body.session);



if(session){

session.position =
body.position;

sessions.set(
body.session,
session
);

}



return Response.json({

ok:true

});


}




/*
 CERRAR SESIÓN

*/

if(url.pathname==="/play/stop"){


const id =
url.searchParams.get("session");


const session =
sessions.get(id);


if(session){

session.closed=true;

sessions.set(
id,
session
);

}



return Response.json({

ok:true

});


}





return new Response(
"Fenix Stream Worker activo"
);


}

};
