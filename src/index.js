export default {
  async fetch(request) {

    const target = 
      "https://deportes.ksdjugfssddeports.com/playlist.php?id=39_&sig=92d0fe29f80b6581c49c461bfb789195327c5dc7edd1a21ac9ea8a363a78b6a7";

    const response = await fetch(target, {
      headers: {
        "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept":
        "text/html,application/xhtml+xml"
      }
    });


    const html = await response.text();


    const patterns = [
      /\.m3u8[^"' ]*/gi,
      /https?:\/\/[^"' ]+/gi,
      /\/[^"' ]*(playlist|stream|live|api)[^"' ]*/gi,
      /token[^"' ]*/gi,
      /key[^"' ]*/gi,
      /fetch\([^)]*/gi,
      /xhr[^ ]*/gi,
      /ajax[^ ]*/gi
    ];


    let results = [];


    for (const regex of patterns) {

      const found = html.match(regex);

      if(found){
        results.push(...found);
      }

    }


    results = [...new Set(results)];


    return new Response(
      JSON.stringify({

        status: response.status,

        htmlLength: html.length,

        scripts:
        (html.match(/<script/gi)||[]).length,

        encontrados: results,

        preview:
        html.substring(0,500)

      },null,2),

      {
        headers:{
          "content-type":
          "application/json"
        }
      }
    );

  }
};
