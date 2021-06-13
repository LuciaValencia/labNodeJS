var express = require('express');
var router = express.Router();

const { createHmac }=require("crypto");
//const { config } = require('process');
const jwt = require("jsonwebtoken");
const {resolve}= require('path');
const {rejects}= require('assert');
const {token}= require('morgan');
const db = require("/Users/luciavalencia/Desktop/Node.js/PROJECT/db.js");
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
  res.render('index', { title: 'LAVV', showMe:{show:true}}); //render: primo arg è il nome dell'engine .jade
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

router.put('/login', async function (req, res) { //function(req, res) è uguale a (req, res) => {...} OJO ASYNC!!
  const {email, password} = req.body; //REACT ce lo manderebbe in json nel body

  if(email && password){
    const hmac = createHmac ("sha256", superServerSecret);
    console.log(db)
    const user =  await db.findUserByMail(email)
    console.log(user);
    if(user){
      const digest = hmac.update(password).digest("hex"); //digest che ci viene passata al login
      if (user.password && user.password === digest) {
        const token = await generateAccessToken(email);
        res.header("JWT-TOKEN", token)
        res.send({ message: `welcome ${email}` });
        return;
      }
    }
  }
  else {
  res.statusCode = 400;
  res.send ({error: "wrong data"})
  return }
});



module.exports = router;
