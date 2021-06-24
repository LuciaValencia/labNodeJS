//file helper per la connessione con il db
const  {MongoClient}=require("mongodb");

require('dotenv').config();

const uri = process.env.MONGO_URI
const dbname="local"



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

