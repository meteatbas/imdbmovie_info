var express = require('express');
var router = express.Router();
const request=require('request');
const { response } = require('../app');

const apiKey='d5dd8671d8f63ec784ce9a20b9411e8b';
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req,res,next)=>{
  res.locals.imageBaseUrl=imageBaseUrl; //to use it(middleware) in index.ejs template
  next();
})

/* GET home page. */
router.get('/', function(req, res, next) {
    // request.get takes 2 args
    //1.it takes the url to http get
    //2.the callback to run when http response is back 3 args:
    //  1.error (if any)
    //  2.http response
    //  3.json/data the server sent back
    request.get(nowPlayingUrl,(error,response,movieData)=>{
      // console.log('error:');
      // console.log(error);
      // console.log('response:');
      // console.log(response);
      // console.log(movieData);
      const parsedData=JSON.parse(movieData)
      res.render('index',{
        parsedData:parsedData.results
      })
    });
    //id is going to store in.. :id wildcard
    router.get('/movie/:id',(req,res,next)=>{
      // res.json(req.params.id);
      const movieId=req.params.id;
      const thisMovieUrl=`${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
      // res.send(thisMovieUrl)
      request.get(thisMovieUrl,(error,response,movieData)=>{
        const parsedData=JSON.parse(movieData)
        res.render('single-movie',{
          parsedData:parsedData
        })
      })
    })
    
    
});


router.post('/search',(req,res,next)=>{
  // res.send('check')
  const userSearchTerm=encodeURI(req.body.movieSearch); //it gets from the template encodeUri to get ride of space in url
  const cat=req.body.cat;
  const movieUrl=`${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;
  // res.send(movieUrl)
  request.get(movieUrl,(error,response,movieData)=>{
    let parsedData=JSON.parse(movieData);
    // res.json(parsedData);
    if (cat=="person") {
      parsedData.results=parsedData.results[0].known_for;
    }
    res.render('index',{
      parsedData:parsedData.results
    })
  })

})

module.exports = router;
