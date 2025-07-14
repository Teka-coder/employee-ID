require('dotenv').config()
const express = require('express')
const mysql = require('mysql')

const connection = mysql.createConnection(
    {
        host: process.env.HOST,
        user: 'root',
        password: '1234',
        database: process.env.DATABASE
    }

    // {
    //     host: process.env.HOST,
    //     user: process.env.USER,
    //     password: process.env.PASSWORD,
    //     database: process.env.DATABASE
    // }
)
connection.connect(err=>{
    if(err){
        if (err.code === 'PROTOCOL_PACKETS_OUT_OF_ORDER') {
            // Handle the specific error
          }
        console.log(`Database connection error: ${err.message}`)
    }else{
        console.log('Database connected successfully')
    }
})

module.exports = connection

