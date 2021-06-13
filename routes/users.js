var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");

const db = require("../db")   //connession file helper per la connessione col db
require("dotenv").config()

function authenticateToken(req, res, next){
  const token = req.headers["token"]

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if(err)return res.sendStatus(403)
    req.user = user;
  
    next();
  })
};

router.use(authenticateToken);

// const users = { luis: "lavava", lucia: "jawaad", fa: "lucho"}; //lista degli utenti

// function simpleAuth(req, res, next) {  //creazione del token per l'accesso
//   const {token}=req.query

//   if (token !== "123"){
//     res.send("ERROR!")
//     return
//   }
//   next(); 
// }

// router.use(simpleAuth)

/* GET users listing. */
// router.get('/id/:id', function(req, res) { //localhost:3000/users/id/a -->lavava
//   const {id} = req.params; 

//   if (!id){
//     res.send("NO ID")
//     return //interrompe l'esecuzione della chiamata fin quando non viene soddisfatto il non-if: EARLY RETURN
//   }

//   const user = users[id] || null;
//   if (!user){
//     res.send("NO user found")
//     return
//   }

//   res.send(user);
// });

// router.get('/', function(req, res, next) {
//   res.render("users", {userList: Object.values(users)});
// });

// router.get("/", function(req, res, next){
//   res.send("respond with a resource")
// });

router.get("/", async function(req, res, next){
  const users = await db.getAllUsers()
  res.json(users);
});

module.exports = router;
