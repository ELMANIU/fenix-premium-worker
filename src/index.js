export default {
async fetch(){

const url="https://deportes.ksdjugfssddeports.com/";

const r=await fetch(url,{
headers:{
"User-Agent":
"Mozilla/5.0 (Linux; Android 13) Chrome/120 Mobile Safari/537.36"
}
});

const html=await r.text();

const links=[
...html.matchAll(/https?:\/\/[^"'\\s]+/g)
].map(x=>x[0]);

const scripts=[
...html.matchAll(/<script[^>]+src=["']([^"']+)/g)
].map(x=>x[1]);

const m3u=[
...html.matchAll(/[^\s"'<>]+\.m3u8[^\s"'<>]*/g)
].map(x=>x[0]);

return new Response(JSON.stringify({
status:r.status,
links,
scripts,
m3u8:m3u,
fragmento:html.substring(0,3000)
},null,2),{
headers:{
"content-type":"application/json"
}
});

}
}
