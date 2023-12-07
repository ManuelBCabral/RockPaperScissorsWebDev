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
app.use(express.static(__dirname +'/views'));

app.get('/',function(reg,res){
    pool.query('Select * FROM user WHERE userid = 1',(err,rows)=>{
        if (err) throw err;
        if(!err){
            console.log(rows.length);
            res.render('RockPaperScissors.ejs',{rows});
        }
    })
    
})
app.get('/highscore',function(reg,res){
    pool.query('SELECT high_score.score,high_score.username FROM high_score ORDER BY score DESC',(err,result)=>{
        if (err) throw err;
        if(!err){
            console.log(result);
            res.render('highscore.ejs',{data:result});
        }
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

