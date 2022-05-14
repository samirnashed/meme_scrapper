const express = require('express')
var fs        = require('fs'); 
const request = require('request');
const client  = require('https');  
const axios   = require('axios')
const app     = express()
const PORT    = 8000
let test;
// const main_URLS = require('/Users/samirnashed/Documents/Web_Scraper/componenets/JSON/urls.json');
// var download = function(uri, filename, callback){
//   request.head(uri, function(err, res, body){
//     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//   });
// }

const path = '/Users/samirnashed/Documents/Web_Scraper/componenets/JSON/urls.json';
let main_URLS = [];
let whole_array=[]
let bad_Urls = 0;
let time = 'before';

function mount_json(){
  fs.readFile(path, "utf8", (err, jsonString) => {
    if (err) {
      console.error("File read failed:", err);
      return;
    }
    let test = JSON.parse(jsonString);
    main_URLS = test.data
  });
}

async function writeToFile (html) {
  let test = [];
  test.push(html)
  const json = JSON.stringify(test)

  fs.writeFile(path, json, (err) => {
    if (err) {
      console.error(err)
      throw err
    }
    console.log('Saved data to file.')
  })
}

async function check(counter){
  try{
    let html = whole_array[counter].url
    axios.get(html)
    .then(response => {
      var data = response.status;
      if(data != 404){
        var testing = html.substring(html.lastIndexOf('/')+1);
        var name = testing.split('?')[0];
        let title_temp = whole_array[counter].title
        if(whole_array[counter].thumbnail === "nsfw"){
          name = "[NSFW]_"+name;
        }
        download(html,name);
      }
      else{
        console.error("Status: " + 404);
      }
    }).catch(err => console.error("error avoided"))
    }
    catch(err){
      console.error("CHECK OUT")
    }  
}

var download = async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
      client.get(url, (res) => {
        console.log(filepath)
        filepath = "componenets/pictures/" + filepath
          if (res.statusCode === 200) {
            res.pipe(fs.createWriteStream(filepath))
                .on('error', reject)
                .once('close', () => resolve(filepath));
          } else {
              // Consume response data to free up memory
              res.resume();
              // reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

          }
      });
  });
}

async function testfinal(counter){
  return new Promise((resolve,reject)=>{
    check(counter)
    setTimeout(()=>{
          resolve();
      ;} , 250
    );
  });
}




const returnInfo_picture = []


async function get_urls(search,letscount){

  var html= 'https://api.pushshift.io/reddit/search/submission/?'+search+'&size=500&'+time+'='+letscount+'h&after='+letscount+1+'h&fields=url,title,thumbnail,is_reddit_media_domain&post_hint=image'
  //console.log(html)
  try{
    axios.get(html)
    .then(response => response.data)
    .then(data =>{ 
      var length_data = data.data.length;
      var _counter_ = 0
      while(_counter_ < length_data){
        //console.log(data.data[_counter_].is_reddit_media_domain)
          const URL = data.data[_counter_].url
          if(returnInfo_picture.indexOf(URL) && !URL.indexOf('https://')){
              whole_array.push(data.data[_counter_]);
              returnInfo_picture.push(URL);
        }
        
      
      _counter_++
    }
    }).catch(err=>console.error(err))
  }
  catch(err){
    console.log("out url",err)
  }
  
}

function testAsync(search,count){
  return new Promise((resolve,reject)=>{
    get_urls(search,count)
    setTimeout(()=>{
      resolve();
      ;} , 2500
    );
  });
}
function writejson(){
  return new Promise((resolve,reject)=>{
    writeToFile()
    setTimeout(()=>{
          resolve();
      ;} , 5000
    );
  });
}

function wait(){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
          resolve();
      ;} , 550000
    );
  });
}




async function callerFun(){
  var letscount = 0
  let counter = 0
  var Urls = ['q=meme','q=memes','subreddit=DankMemesFromSite19','subreedit=terriblefacebookmemes','subreddit=raimimemes','subreddit=PrequelMemes','subreddit=PoliticalCompassMemes','subreddit=ComedyCemetery','subreddit=marvelmemes','subreddit=memes','subreddit=dankmemes','subreddit=Memes_Of_The_Dank','subreddit=meme','subreddit=Animemes','subreddit=dndmemes','subreddit=PoliticalCompassMemes','subreddit=memesITA','subreddit=goodanimemes','subreddit=MemeEconomy','subreddit=MemeTemplatesOfficial','subreddit=HistoryMemes','subreddit=raimimemes','subreddit=MinecraftMemes','subreddit=DankMemesFromSite19','subreddit=lotrmemes','subreddit=MemesIRL','subreddit=Memeulous','subreddit=memexico']
  let url_counter = 0
  // mount_json()
  while(true){
    console.log(letscount)
    while ( url_counter <Urls.length){
      try{
        console.log(Urls[url_counter])
        await testAsync(Urls[url_counter],letscount);
        // console.log("TEST")
        console.log("Total URLS: ", returnInfo_picture.length)
        
        while(counter < returnInfo_picture.length){
          try{
            // console.log(returnInfo_picture[counter])
            await testfinal(counter)
          }
          catch(err){
            console.error(err)
            console.log("RET")
          }
          counter++
        }
        console.log("downloadable pictures: ", returnInfo_picture.length-bad_Urls)
        // console.log("BAD")
      }
      catch(err){
        console.error(err)
      }
      url_counter++
    }
    
    url_counter = 0;
    letscount = letscount +5
  }
  
  
  
}

try{
  callerFun();
}
catch(error){
  console.error("Test")
}


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
