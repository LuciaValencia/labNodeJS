var mysql = require("mysql2")
require('dotenv').config();


class DB {
    constructor(){
        this.connection = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        })
    }

    async listProjects (tableName){
        return new Promise((resolve, reject) => {
            this.connection.query(`SELECT * FROM ${tableName}`, (error, results) =>{
                if(error) reject (error)
                resolve (results)
            })
        })
    }

    async projectsByYear (tableName, year){
        return new Promise((resolve, reject) => {
            this.connection.execute(`SELECT * FROM ${tableName} WHERE period LIKE ?`,[`${year}%`] ,(error, results) =>{ //execute: come query ma più specifica; % sanifica
                if(error) reject (error)
                resolve (results)
            })
        })
    }
    async projectsByRegion (tableName, region){
        return new Promise((resolve, reject) => {
            this.connection.execute(`SELECT * FROM ${tableName} WHERE region LIKE ?`,[`%${region}%`] ,(error, results) =>{ //execute: come query ma più specifica; %...% match parziale
                if(error) reject (error)
                resolve (results)
            })
        })
    }
}

module.exports = DB;