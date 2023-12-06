const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql2');

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Dakar2002kc!",
  database: "rockpaperscissors",
  connectionLimit:10
});
app.set('view-engine','ejs')

app.get('/',function(reg,res){
    res.render('RockPaperScissors.ejs')
})
app.get('/highscore',function(reg,res){
    pool.query('SELECT high_score.score,high_score.username FROM high_score ORDER BY score',function(err,rows){
        if (err) throw err;
        if(!err){
            console.log(rows.length);
            res.render('highscore.ejs',{rows});
        }
    })
})

