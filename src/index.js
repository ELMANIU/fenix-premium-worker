export default {
async fetch(){

const page = await fetch(
"https://deportes.ksdjugfssddeports.com/",
{
headers:{
"User-Agent":
"Mozilla/5.0 (Linux; Android 13) Chrome/120 Mobile Safari/537.36"
}
});

const cookies = page.headers.get("set-cookie") || "";

const playlist = await fetch(
"https://deportes.ksdjugfssddeports.com/playlist.php?id=39_&sig=26b773d9d875f444a07cc001157928e5c9932fab6dd09e77e24ae2a7e64567cc",
{
headers:{
"User-Agent":
"Mozilla/5.0 (Linux; Android 13) Chrome/120 Mobile Safari/537.36",

"Referer":
"https://deportes.ksdjugfssddeports.com/",

"Cookie":cookies
}
});

return new Response(JSON.stringify({
pagina:page.status,
cookies,
playlist:playlist.status,
resultado:(await playlist.text()).slice(0,500)
},null,2),{
headers:{
"content-type":"application/json"
}
});

}
}
