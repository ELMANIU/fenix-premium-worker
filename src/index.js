export default {
 async fetch(request) {

  const url = "https://deportes.ksdjugfssddeports.com/playlist.php?id=39_&sig=26b773d9d875f444a07cc001157928e5c9932fab6dd09e77e24ae2a7e64567cc";

  const r = await fetch(url,{
    method:"GET",
    headers:{
      "User-Agent":
      "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",

      "Accept":
      "application/vnd.apple.mpegurl,application/x-mpegURL,*/*",

      "Referer":
      "https://deportes.ksdjugfssddeports.com/",

      "Origin":
      "https://deportes.ksdjugfssddeports.com"
    },
    redirect:"follow"
  });


  const texto = await r.text();

  return new Response(JSON.stringify({
    status:r.status,
    url:r.url,
    headers:Object.fromEntries(r.headers),
    contenido:texto.substring(0,1000)
  },null,2),{
    headers:{
      "content-type":"application/json"
    }
  });

 }
}
