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


var download = async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
      client.get(url, (res) => {
        filepath = "componenets/pictures/" + filepath
          if (res.statusCode === 200) {
            console.log(url)
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


async function check(html){
  try{
    axios.get(html)
    .then(response => {
      var data = response.status;
      if(data != 404){
        var testing = html.substring(html.lastIndexOf('/')+1);
        var name = testing.split('?')[0];
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
function testfinal(html){
  return new Promise((resolve,reject)=>{
    try{
      check(html)}
      catch(err){
        console.log("a7a")
      }
    setTimeout(()=>{
          resolve();
      ;} , 50
    );
  });
}




const returnInfo_picture = []


async function get_urls(letscount){
  var html= 'https://api.pushshift.io/reddit/search/submission/?q=memes&size=500&before='+letscount+'m&fields=post_hint,url,title,is_reddit_media_domain,thumbnail&post_hint=image'
  try{
    axios.get(html)
    .then(response => response.data)
    .then(data =>{ 
      var length_data = data.data.length;
      var _counter_ = 0
      while(_counter_ < length_data){
        if(data.data[_counter_].is_reddit_media_domain == true){
          const URL = data.data[_counter_].url
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

function testAsync(trysth){
  return new Promise((resolve,reject)=>{
    get_urls(trysth)
    setTimeout(()=>{
      resolve();
      ;} , 5000
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




async function callerFun(){
  var letscount = 1
  let counter = 0
  // mount_json()
  while(true){
    try{
      console.log(letscount)
      await testAsync(letscount);
      console.log("TEST")
    }
    catch(err){
      console.error(err)
    }
    while(counter < returnInfo_picture.length){
      try{
        await testfinal(returnInfo_picture[counter])
      }
      catch(err){
        console.error(err)
        console.log("RET")
      }
      counter++
    }
    console.log("BAD")
    letscount = letscount +1
  }
  
  
  
}

try{
  callerFun();
}
catch(error){
  console.error("Test")
}


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))