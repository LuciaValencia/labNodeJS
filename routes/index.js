var express = require('express');
var router = express.Router();

const { createHmac }=require("crypto");
//const { config } = require('process');
const jwt = require("jsonwebtoken");
const {resolve}= require('path');
const {rejects}= require('assert');
const {token}= require('morgan');
//const db = require("/Users/luciavalencia/Desktop/Node.js/PROJECT/db.js");
const DB = require('/Users/luciavalencia/Desktop/Node.js/PROJECT/db1.js');
const db = new DB()
require('dotenv').config();
const superServerSecret= process.env.SUPER_SECRET; //HASH: 7eb0c9acedafa211a86c99daae3b4ccab166998ff4b9f2fd5cc2bbb6fbbc9279

function generateAccessToken(username){
  return new Promise((resolve, rejects) => {
    jwt.sign(username, process.env.TOKEN_SECRET, (error, token) =>{
      if(error){
        rejects(error)
        return
      }
      resolve(token)
    })
  })
};

//const userData=[{email: "lucia.valenciavas@edu.unito.it", password: "7eb0c9acedafa211a86c99daae3b4ccab166998ff4b9f2fd5cc2bbb6fbbc9279"}];

/* GET home page. */
router.get('/', async function(req, res, next) {
  const results = await db.listProjects("projects");
  res.render('index', { title: 'LAVV', json: results, showMe:{show:true}}); //render: primo arg è il nome dell'engine .jade
});

router.get('/query', function(req, res, next) {
  res.send(JSON.stringify(req.query))
});
router.get('/param/:paramValue/other/:otherValue', function(req, res, next) {
  const {query, params} = req
  res.json({query, params})
});

router.get("/new-password/:pwd", (req, res) => {
  const {pwd}=req.params;
  const hmac = createHmac ("sha256", superServerSecret);
  
  res.json({hash:hmac.update(pwd).digest("hex")})
})

router.post('/', function(req, res) {
  const{body} = req; //qnd un'app web fa reqs ad un server rest, i dati vengono inseriti nel body come json
  res.send(body);
});

router.get('/year/:year', async (req, res) => {
  const{params} = req; //qnd un'app web fa reqs ad un server rest, i dati vengono inseriti nel body come json
  const{year} = params;
  const result = await db.projectsByYear("projects", year)

  res.render('index', { title: 'LAVV', json: result, showMe:{show:true}});
});

router.get('/region/:region', async (req, res) => {
  const{params} = req; //qnd un'app web fa reqs ad un server rest, i dati vengono inseriti nel body come json
  const{region} = params;
  const result = await db.projectsByRegion("projects", region)

  res.render('index', { title: 'LAVV', json: result, showMe:{show:true}});
});





module.exports = router;
