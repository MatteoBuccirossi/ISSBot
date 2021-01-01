const config = require('./config');
const fetch = require('node-fetch');
const fs = require('fs');
const twit = require('twit');

const T = new twit(config);

let charmers = ['Have a nice day.', 'Good sightings.', 'May the sky be clear.', "You're welcome"];

async function reTweet(){
    let lastId = await fs.readFileSync('lastId.txt', 'utf8');
    console.log('checking');
  

    

    let params = {
        q: '@ISStracker1 ',
        count: 20,
        since_id: lastId,

    }
    await T.get('search/tweets', params, async function(error, data, response){
        let tweets = data.statuses;

        

        //queryId for tweet text = tweets[i].text
        //queryId for tweet user's name = tweets[i].user.screen_name
        //queryId for tweet id = tweets[i].id

       
      

        for(let tweet of tweets ){
            console.log('replying');

            
                let x, y;
                let str= tweet.text;
                var lowerStr= str.toLowerCase();
                var splitStr = lowerStr.split(" ");

                for(let word of splitStr){

                     if(word.includes('x')){

                        let valX = word.split('x');
                        x = parseInt(valX[1]);

                     }else if(word.includes('y')){

                        let valY = word.split('y');
                        y = parseInt(valY[1]);
                    }    
                }

               

                let res = await fetch(`http://api.open-notify.org/iss-pass.json?lat=${x}&lon=${y}`);
                let resJson = await res.json();

                
                let unixTime = resJson.response[0].risetime;

                 var date = new Date(unixTime * 1000);
                var options = {hour: 'numeric', minute: 'numeric'};
                let formattedTime = date.toLocaleDateString('en-GB', options);
                
                
                T.post('statuses/update', {status: `@${tweet.user.screen_name} next fly-by at ${formattedTime} CET. ${charmers[Math.floor(Math.random()* charmers.length)]} #Space`},
                (err, data, res)=>{
                 
                });

              await fs.writeFileSync('lastId.txt', `${tweet.id_str}`);
        

    
    }
    });
    
}

setInterval(function() { reTweet(); }, 60000)



