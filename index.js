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

async function check(html){
    axios.get(html)
    .then(response => {
      var data = response.status;
      if(data != 404){
        var testing = html.substring(html.lastIndexOf('/')+1);
        var name = testing.split('?')[0];
        // console.log("NAME: ",name)
        // console.log(name.lastIndexOf('.'))
        if(name.lastIndexOf('.') === -1){
          console.log("FIX: ", name+ ".png")
        }
        
        // console.log(name)
        // let title_temp = whole_array[counter].title
        // if(whole_array[counter].over_18 === true){
        //   name = "[NSFW]_"+name;
        // }
        // console.log(name)
        download(html,name);
      }
      else{
        console.error("Status: " + 404);
      }
    }).catch(err => {
      null
      // console.error("error avoided")
    })
}

var download = async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
      client.get(url, (res) => {
        filepath = "componenets/pictures/" + filepath
          if (res.statusCode === 200) {
            res.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath));
          } else {
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

  var html= 'https://api.pushshift.io/reddit/search/submission/?'+search+'&size=500&'+time+'='+letscount+'h&after='+letscount+1+'h&fields=url,title,thumbnail,over_18,is_reddit_media_domain&post_hint=image'
  axios.get(html)
    .then(response => response.data)
    .then(data =>{ 
      var length_data = data.data.length;
      var _counter_ = 0
      while(_counter_ < length_data){
          const URL = data.data[_counter_].url
          if(returnInfo_picture.indexOf(URL) && !URL.indexOf('https://')){
              // whole_array.push(data.data[_counter_]);
              returnInfo_picture.push(URL);
        }
      _counter_++
    }
    }).catch(err=>console.error(err))
  
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

const callback = async function(data) {
  let array = data.images_results
  for (let index = 0; index < array.length; index++) {
    let current_url = array[index].original
    if(!current_url.indexOf('https://'))
    returnInfo_picture.push(current_url)
  }
};

function search_google(params){
  return new Promise((resolve,reject)=>{
    search.json(params, callback);
    setTimeout(()=>{
          resolve();
      ;} , 2500
    );
  });
}


async function callerFun(){
  var letscount = 0
  
  let counter = 0
  var Urls = ['q=meme','q=memes','subreddit=DankMemesFromSite19','subreedit=terriblefacebookmemes','subreddit=raimimemes','subreddit=PrequelMemes','subreddit=PoliticalCompassMemes','subreddit=ComedyCemetery','subreddit=marvelmemes','subreddit=memes','subreddit=dankmemes','subreddit=Memes_Of_The_Dank','subreddit=meme','subreddit=Animemes','subreddit=dndmemes','subreddit=PoliticalCompassMemes','subreddit=memesITA','subreddit=goodanimemes','subreddit=MemeEconomy','subreddit=MemeTemplatesOfficial','subreddit=HistoryMemes','subreddit=raimimemes','subreddit=MinecraftMemes','subreddit=DankMemesFromSite19','subreddit=lotrmemes','subreddit=MemesIRL','subreddit=Memeulous','subreddit=memexico']
  let url_counter = 0
  while(true){
    // console.log(letscount)
    var params = {
      engine: "google",
      ijn: String(letscount),
      q: "meme",
      google_domain: "google.com",
      num: "100",
      tbm: "isch",
      no_cache: "true"
    };
    // try{
    //   await search_google(params)
    // }
    // catch(err){
    //   console.log(err)
    // }

    // console.log("Google Searched")
    while ( url_counter <Urls.length){
      try{
        // console.log("Total URLS: ", returnInfo_picture.length)
        await testAsync(Urls[url_counter],letscount);
        while(counter < returnInfo_picture.length){
          try{
            await testfinal(returnInfo_picture[counter])
          }
          catch(err){
            console.error(err)
          }
          counter++
        }
        console.log("downloadable pictures: ", returnInfo_picture.length-bad_Urls)
      }
      catch(err){
        console.error(err)
      }
      url_counter++
    }
    
    url_counter = 0;
    letscount++
  }
  
  
  
}

try{
  callerFun();
}
catch(error){
  console.error("Test")
}


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
