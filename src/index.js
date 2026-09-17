const DOMAIN = "https://deportes.ksdjugfssddeports.com";

const PLAYLIST =
DOMAIN +
"/playlist.php?id=39_&sig=92d0fe29f80b6581c49c461bfb789195327c5dc7edd1a21ac9ea8a363a78b6a7";


const BROWSER_HEADERS = {
  "User-Agent":
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",

  "Accept":
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",

  "Accept-Language":
  "es-MX,es;q=0.9,en;q=0.8",

  "Cache-Control":
  "no-cache",

  "Pragma":
  "no-cache",

  "DNT":
  "1",

  "Sec-Fetch-Dest":
  "document",

  "Sec-Fetch-Mode":
  "navigate",

  "Sec-Fetch-Site":
  "none"
};



async function request(url, extra={}){

return await fetch(url,{
  redirect:"follow",
  headers:{
    ...BROWSER_HEADERS,
    ...extra
  }
});

}



async function debugHome(){

const res =
await request(DOMAIN+"/");

const text =
await res.text();


return {
 status:res.status,
 url:res.url,
 type:res.headers.get("content-type"),
 server:res.headers.get("server"),
 cookies:res.headers.get("set-cookie"),
 size:text.length,
 preview:text.substring(0,500)
};

}



async function debugPlaylist(){

const home =
await request(DOMAIN+"/");


const cookie =
home.headers.get("set-cookie") || "";


const res =
await request(PLAYLIST,{
 "Referer":DOMAIN+"/",
 "Origin":DOMAIN,
 "Accept":
 "application/vnd.apple.mpegurl,application/x-mpegURL,*/*",
 "Cookie":cookie
});


const text =
await res.text();


return {

status:res.status,

url:res.url,

type:
res.headers.get("content-type"),

cookies:cookie,

size:text.length,

preview:text.substring(0,500)

};

}



export default {

async fetch(request){

const url =
new URL(request.url);


if(url.pathname==="/"){

return Response.json({
service:"Fenix Premium Debug v3",
routes:[
"/home",
"/playlist"
]
});

}



if(url.pathname==="/home"){

return Response.json(
await debugHome()
);

}



if(url.pathname==="/playlist"){

return Response.json(
await debugPlaylist()
);

}



return new Response("404");

}

};
