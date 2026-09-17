const SECRET = "CAMBIA_ESTA_CLAVE";

const VIDEOS = {
  pelicula1:
  "https://hugh.cdn.rumble.cloud/video/fwe2/74/s8/2/w/W/I/Y/wWIYA.aaa.mkv"
};


async function createToken(id){

  const exp = Math.floor(Date.now()/1000) + (60*60*4);

  const data = `${id}.${exp}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    {name:"HMAC", hash:"SHA-256"},
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );

  const token =
    btoa(data+"."+Array.from(new Uint8Array(sig))
    .map(b=>b.toString(16).padStart(2,"0"))
    .join(""));

  return token;
}


async function verifyToken(token,id){

  try{

    const raw = atob(token);

    const parts = raw.split(".");

    const exp = Number(parts[1]);

    if(Date.now()/1000 > exp)
      return false;

    return true;

  }catch(e){
    return false;
  }

}


export default {

async fetch(request){

const url = new URL(request.url);


if(url.pathname==="/generate"){

 const token =
 await createToken("pelicula1");

 return Response.json({
   url:
   `/play?id=pelicula1&token=${encodeURIComponent(token)}`
 });

}


if(url.pathname==="/play"){

 const id=url.searchParams.get("id");
 const token=url.searchParams.get("token");


 if(!id || !token)
 return new Response("Falta acceso",{status:401});


 const ok=
 await verifyToken(token,id);


 if(!ok)
 return new Response("Token expirado",{status:403});


 const video=VIDEOS[id];


 if(!video)
 return new Response("No existe",{status:404});


 return fetch(video,{
   headers:{
    "Range":
    request.headers.get("Range") || ""
   }
 });

}


return new Response("Fenix Stream Worker");

}

};
