const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql2');
const bcrypt = require('bcrypt')

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Dakar2002kc!",
  database: "rockpaperscissors",
  connectionLimit:10
});
app.set('view-engine','ejs')
app.use(express.static(__dirname +'/views'));

app.get('/',function(req,res){
    /*pool.query('Select * FROM user WHERE userid = 1',(err,rows)=>{
        if (err) throw err;
        if(!err){
            console.log(rows.length);
            res.render('RockPaperScissors.ejs',{rows});
        }*/
    res.render('RockPaperScissors.ejs',{name: user})
    })
    
//})
app.get('/highscore',function(reg,res){
    pool.query('SELECT high_score.score,high_score.username FROM high_score ORDER BY score DESC',(err,result)=>{
        if (err) throw err;
        if(!err){
            console.log(result);
            res.render('highscore.ejs',{data:result});
        }
    })
})
app.post("/register",async(req,res)=>{
    const user=req.body.username;
    const hashedPassword= await bcrypt.hash(req.body.password,10);

    pool.getConnection(async (err,connection)=>{
        if (err) throw (err);
        const sqlSearch='SELECT * FROM user WHERE user=?'
        const search_query = mysql.format(sqlSearch,[user]);
        const sqlinsert='INSERT INTO user VALUES (0,0,?,?)'
        const insert_query = mysql.format(sqlinsert,[hashedPassword,user])

        await connection.query(search_query, async(err,result)=>{
            if (err)throw(err)
            if(result.length !=0){
                connection.release();
                console.log("User already exists");
            }
            else{
                await connection.query(insert_query,(err,result)=>{
                    connection.release()
                    console.log("Created new User");
                    console.log(result.insertId);
                })
            }
        })
    })
})
app.get('/register', checkNotAuthenticated, async (req,res) => {
    res.render('register.ejs')
})
app.post('/login',(req,res)=>{
    const user=req.body.username;
    const password = req.body.password;
    pool.getConnection(async(req,res)=>{
        if (err) throw(err)
        const sqlSearch='SELECT * FROM user WHERE user=?'
        const search_query = mysql.format(sqlSearch,[user]);
        await connection.query(search_query, async(err,result)=>{
            connection.release()
            if (err)throw(err);
            if(result.length==0){
                console.log("user does not exists");
            }
            else{
                const hashedPassword = result[0].password;
                if(await bcrypt.compare(password,hashedPassword)){
                    console.log("Login successful");
                }
                else{
                    console.log("Incorrect password")
                }
            }
        })
    })
})
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

