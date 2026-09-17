export default {
  async fetch(request) {

    const target =
      "https://deportes.ksdjugfssddeports.com/playlist.php?id=39_&sig=92d0fe29f80b6581c49c461bfb789195327c5dc7edd1a21ac9ea8a363a78b6a7";


    let response;

    try {

      response = await fetch(target, {

        method: "GET",

        headers: {

          "User-Agent":
          "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",

          "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",

          "Accept-Language":
          "es-MX,es;q=0.9,en;q=0.8",

          "Referer":
          "https://deportes.ksdjugfssddeports.com/",

          "Origin":
          "https://deportes.ksdjugfssddeports.com",

          "Cache-Control":
          "no-cache",

          "Pragma":
          "no-cache",

          "Upgrade-Insecure-Requests":
          "1",

          "Sec-Fetch-Dest":
          "document",

          "Sec-Fetch-Mode":
          "navigate",

          "Sec-Fetch-Site":
          "same-origin"

        }

      });


    } catch(error) {

      return new Response(JSON.stringify({

        error:"fetch_failed",

        message:error.message

      },null,2),{

        headers:{
          "content-type":"application/json"
        }

      });

    }



    const html = await response.text();



    let encontrados = [];



    const patrones = [

      /https?:\/\/[^\s"'<>]+/gi,

      /[^"'<> ]+\.m3u8[^"'<> ]*/gi,

      /[^"'<> ]+playlist[^"'<> ]*/gi,

      /[^"'<> ]+stream[^"'<> ]*/gi,

      /[^"'<> ]+live[^"'<> ]*/gi,

      /[^"'<> ]+token[^"'<> ]*/gi,

      /[^"'<> ]+key[^"'<> ]*/gi,

      /fetch\s*\([^)]*/gi,

      /XMLHttpRequest/gi,

      /ajax/gi,

      /api\/[^"'<> ]+/gi

    ];



    for(const regex of patrones){

      const datos = html.match(regex);

      if(datos){

        encontrados.push(...datos);

      }

    }



    encontrados = [...new Set(encontrados)];



    const scripts = [

      ...(html.match(/<script[\s\S]*?<\/script>/gi) || [])

    ];



    const cookies = response.headers.get("set-cookie");



    return new Response(

      JSON.stringify({

        estado: response.status,

        url: target,

        longitudHTML: html.length,

        scriptsEncontrados: scripts.length,

        cookies,

        encontrados,

        headers: Object.fromEntries(response.headers),

        preview: html.substring(0,800)

      },null,2),

      {

        headers:{

          "content-type":"application/json;charset=UTF-8"

        }

      }

    );


  }

};
