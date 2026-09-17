const HOME =
"https://deportes.ksdjugfssddeports.com/";

const PLAYLIST =
"https://deportes.ksdjugfssddeports.com/playlist.php?id=39_&sig=92d0fe29f80b6581c49c461bfb789195327c5dc7edd1a21ac9ea8a363a78b6a7";


const HEADERS = {
  "User-Agent":
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",

  "Accept":
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};



function extract(html){

  const scripts =
  [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(x=>x[1])
  .filter(Boolean);


  const urls =
  [...html.matchAll(/https?:\/\/[^\s"'<>]+/g)]
  .map(x=>x[0]);


  const cookies =
  [...html.matchAll(/document\.cookie\s*=\s*([^;]+)/g)]
  .map(x=>x[1]);


  const variables =
  [...html.matchAll(/(?:token|key|hash|sig|auth)[^"'=\s]{0,20}/gi)]
  .map(x=>x[0]);


  return {
    scriptsCount:scripts.length,
    scripts,
    urls,
    cookies,
    variables
  };

}



async function analyze(){

 const res =
 await fetch(HOME,{
   headers:HEADERS
 });


 const html =
 await res.text();


 return {
   status:res.status,
   type:res.headers.get("content-type"),
   cookies:res.headers.get("set-cookie"),
   length:html.length,
   analysis:extract(html),
   preview:html.substring(0,3000)
 };

}



async function testPlaylist(){

const res =
await fetch(PLAYLIST,{
 headers:{
   ...HEADERS,
   "Referer":HOME
 }
});


return {
 status:res.status,
 type:res.headers.get("content-type"),
 preview:(await res.text()).substring(0,500)
};

}



export default {

async fetch(request){

const url =
new URL(request.url);


if(url.pathname==="/"){
 return Response.json({
  service:"Fenix Premium Extractor v4",
  routes:[
   "/analyze",
   "/playlist"
  ]
 });
}


if(url.pathname==="/analyze"){
 return Response.json(await analyze());
}


if(url.pathname==="/playlist"){
 return Response.json(await testPlaylist());
}


return new Response("404");

}

};
