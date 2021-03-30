const mysql = require('mysql');
const express = require('express')
const app = express()

const createDatabase = database => new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
        host: 'mydatabase.hash.region.rds.amazonaws.com',
        user: 'login',
        password: 'password'
        // database: 'mydatabase'
    });
    connection.connect((err) => {
        if (err) throw err;
        // console.log('Connected 1!');
        connection.query("CREATE DATABASE IF NOT EXISTS mydatabase2", function (err, result) {
            if (err) throw err;
            resolve("mydatabase");
        });
    });
})

const createTable = table => new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'mydatabase.hash.region.rds.amazonaws.com',
            user: 'login',
            password: 'password'
            database: 'mydatabase2'
        });

        connection.connect((err) => {
            if (err) {
                reject(err);
            }
            // console.log('Connected 2!');

            sql = "CREATE TABLE IF NOT EXISTS mytable";
            sql +='(id int not null auto_increment,\
        tipo varchar(10),\
        categoria varchar(30),\
        descricao varchar(255),\
        valor DECIMAL(13, 2),\
        data timestamp,\
        primary key(id));';

            connection.query(sql, function (err, result) {
                if (err) throw err;
                resolve("mytable")
            });
        });
})

const init = async () => {
    try {
        const criaTabela = await createTable()
        const criaBanco = await createDatabase()
        let myBody = {
            "database": criaBanco,
            "table": criaTabela
        }
        return myBody
    } catch (err) {
        console.log(err)
    }
}

app.use('/', function (req, res){
    init()
        .then( body => res.send(body))
    // res.send("Hello friend!")
})

app.listen(80, '0.0.0.0')
console.log('Listening:  http://localhost:80')
