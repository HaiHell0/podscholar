const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require('express-session')


const ID= 'user';
const PASSWORD = '1';
const DATABASE = 'podscholar';
const NET = 'cluster0.c6lhm.mongodb.net';

const URL = `mongodb+srv://${ID}:${PASSWORD}@${NET}/${DATABASE}?retryWrites=true&w=majority`

var db;
MongoClient.connect(URL, { useUnifiedTopology: true }, function (error, client) {
    if (error) return console.log(error)
    db = client.db('podscholar');
});

const PORT = process.env.PORT || 5500

const demousername = 'user'
const demopasswd ='1'
var session;

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
//Express-session options
const oneDay = 1000*60*60*24
app.use(sessions({
    secret: "abcdefg",
    saveUninitialized: true,
    cookie: {maxAge:oneDay},
    resave: false
}))



app.listen(PORT,function(){
    console.log(`App is listening on port ${PORT}`)
})



app.use(express.static(__dirname));

app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    }else
    res.render('pages/index.ejs')
});

app.post('/user',(req,res) => {
    if(req.body.username == demousername && req.body.password == demopasswd){
        session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
        res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
    }
    else{
        res.send('Invalid username or password');
    }
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});


app.get('/',(req,resp)=>resp.render('pages/index'));



app.get('/pages',(req,resp)=>{
    resp.send('ok') 
});

app.get('/pages/:pagename',(req,resp)=>{
    resp.render(`pages/${req.params.pagename}`)
});




app.get('/:account', function(req, resp){
    db.collection('accounts').findOne({aname : req.params.account},function(error, res){
        if(error)resp.send('404 not found');
        else if(res==null)resp.send('Account not found')
        else{
        console.log(res)
        resp.render('pages/test', {account : res})
        }
    })
});

app.get('/:account/details', function(req, resp){
    db.collection('accounts').findOne({aname : req.params.account},function(error, res){
        if(error)resp.send('404 not found');
        else if(res==null)resp.send('Account not found')
        else{
        console.log(res)
        resp.render('pages/details', {account : res})
        }
    })
});
