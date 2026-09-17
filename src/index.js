const PLAYLIST_URL =
"https://deportes.ksdjugfssddeports.com/playlist.php?id=39_&sig=92d0fe29f80b6581c49c461bfb789195327c5dc7edd1a21ac9ea8a363a78b6a7";

const HOME_URL =
"https://deportes.ksdjugfssddeports.com/";


const BROWSER_HEADERS = {
  "User-Agent":
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",

  "Accept":
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",

  "Accept-Language":
  "es-MX,es;q=0.9,en;q=0.8",

  "Connection":
  "keep-alive"
};



async function getCookies(){

  const response = await fetch(HOME_URL,{
    headers:BROWSER_HEADERS,
    redirect:"follow"
  });


  const cookies =
  response.headers.get("set-cookie") || "";


  return cookies;

}



async function requestPlaylist(){

  const cookies = await getCookies();


  const headers = {

    ...BROWSER_HEADERS,

    "Referer":
    HOME_URL,

    "Origin":
    "https://deportes.ksdjugfssddeports.com",

    "Accept":
    "application/vnd.apple.mpegurl,application/x-mpegURL,*/*",

    "Cookie":
    cookies

  };


  const response =
  await fetch(PLAYLIST_URL,{
    headers,
    redirect:"follow"
  });


  const text =
  await response.text();


  return {
    response,
    text,
    cookies
  };

}



export default {


async fetch(request){

const url =
new URL(request.url);



if(url.pathname==="/"){

return Response.json({

service:"Fenix Premium Worker v2",

status:"online",

test:"/premium/test"

});

}



if(url.pathname==="/premium/test"){


const result =
await requestPlaylist();


return Response.json({

status:
result.response.status,

finalUrl:
result.response.url,

contentType:
result.response.headers.get("content-type"),

cookies:
result.cookies,

length:
result.text.length,

preview:
result.text.substring(0,1000)

});


}



return new Response(
"Not Found",
{
status:404
});


}

};
