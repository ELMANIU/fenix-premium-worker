const PREMIUM_SOURCE =
"https://deportes.ksdjugfssddeports.com/playlist.php?id=39_&sig=92d0fe29f80b6581c49c461bfb789195327c5dc7edd1a21ac9ea8a363a78b6a7";


const SOURCE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",

  "Referer":
    "https://deportes.ksdjugfssddeports.com/",

  "Origin":
    "https://deportes.ksdjugfssddeports.com"
};



async function getPremiumSource(){

  return await fetch(PREMIUM_SOURCE,{
    method:"GET",
    redirect:"follow",
    headers:SOURCE_HEADERS
  });

}



async function stream(request){

  const response = await getPremiumSource();

  const contentType =
    response.headers.get("content-type") || "";

  const body =
    await response.text();


  return new Response(body,{
    status:response.status,
    headers:{
      "content-type":
      contentType.includes("mpegurl")
      ? "application/vnd.apple.mpegurl"
      : "application/vnd.apple.mpegurl",

      "access-control-allow-origin":"*",

      "cache-control":
      "no-cache, no-store"
    }
  });

}



async function test(){

  const response =
    await getPremiumSource();

  const text =
    await response.text();


  return Response.json({

    status:response.status,

    finalUrl:response.url,

    contentType:
    response.headers.get("content-type"),

    length:text.length,

    preview:
    text.substring(0,500)

  });

}



export default {

async fetch(request){

const url =
new URL(request.url);



if(url.pathname==="/"){

return Response.json({

service:
"Fenix Premium Worker",

version:
"1.0.0",

status:
"online",

stream:
"/premium/live.m3u8",

test:
"/premium/test"

});

}



if(url.pathname==="/premium/live.m3u8"){

return stream(request);

}



if(url.pathname==="/premium/test"){

return test();

}



return new Response(
"Ruta no encontrada",
{
status:404
});

}

};
