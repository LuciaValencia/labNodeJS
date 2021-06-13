//file helper per la connessione con il db
const  {MongoClient}=require("mongodb");
//var mysql = require("mysql2")
require('dotenv').config();

const uri = process.env.MONGO_URI
const dbname="local"

// class DB {
//     constructor(){
//         this.connection = mysql.createConnection({
//             host: process.env.MYSQL_HOST,
//             user: process.env.MYSQL_USER,
//             password: process.env.MYSQL_PASSWORD,
//             database: process.env.MYSQL_DATABASE
//         })
//     }

//     async listProjects (tableName){
//         return new Promise((resolve, reject) => {
//             this.connection.query(`SELECT * FROM ${tableName}`, (error, results) =>{
//                 if(error) reject (error)
//                 resolve (results)
//             })
//         })
//     }

//     async projectsByYear (tableName, year){
//         return new Promise((resolve, reject) => {
//             this.connection.execute(`SELECT * FROM ${tableName} WHERE date LIKE ?`,[`${year}%`] ,(error, results) =>{ //execute: come query ma più specifica; % sanifica
//                 if(error) reject (error)
//                 resolve (results)
//             })
//         })
//     }
// }

function connect (){
    return new Promise((resolve, reject) => {
        MongoClient.connect(uri, function(err, client){
            if(err){
                console.log(err);
                reject(err);
                return
            }
            console.log("Successful connection!")
            resolve(client.db(dbname))
        })
    })
}

//QUERY MOLTO SEMPLICE GRAZIE AL FIND
async function getAllUsers(){   //tt le richieste a mongoDB sono metodi  async perchè richieste lunghe e potrebbero bloccare node
    return new Promise (async (resolve, reject) => {
        const db= await connect()
        const collection= db.collection("users"); //tabella

        collection.find({}).toArray(function(err,docs){     //dato non filtrato + callback 
            if (err) {
                console.log(err)
                reject(err)
                return
            }
            console.log("Found the following records:")
            resolve(docs);
        })
    })
}

async function findUserByMail(email){   
    return new Promise (async (resolve, reject) => {
        const db = await connect()
        const collection = db.collection("users"); //tabella

        collection.find({email}).toArray(function(err,docs){    //dato filtrato + callback 
            if (err) {
                console.log(err)
                reject(err)
                return
            }
            console.log("Found the following records:")
            resolve(docs[0]);   //prendiamo solo il primo elemento dell'array generato
        })
    })
}

module.exports.getAllUsers = getAllUsers;

module.exports.findUserByMail = findUserByMail;

//module.exports = DB;