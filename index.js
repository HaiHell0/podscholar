const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const ObjectId = require("mongodb").ObjectId;


const ID = "user";
const PASSWORD = "1";
const DATABASE = "podscholar";
const NET = "cluster0.c6lhm.mongodb.net";

const URL = `mongodb+srv://${ID}:${PASSWORD}@${NET}/${DATABASE}?retryWrites=true&w=majority`

var db;
MongoClient.connect(URL, { useUnifiedTopology: true }, function (error, client) {
    if (error) return console.log(error)
    db = client.db('podscholar');
    console.log("db connected");
});

const PORT = process.env.PORT || 5500

const demousername = 'user'
const demopasswd = '1'
var session = "h";

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
//Express-session options
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "abcdefg",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))



app.listen(PORT, function () {
    console.log(`App is listening on port ${PORT}`)
})



app.use(express.static(__dirname));



app.get('/', (req, res) => {
    res.render("pages/index.ejs");
});

app.get('/register', (req, res) => {
    if (session.userid) {
        res.send(`You are already registered, <a href='/'>go to homepage</a>`);
    } else
        res.render('pages/register.ejs');
})

app.post('/register', (req, res) => {
    db.collection("users").findOne({ email: req.body.email }, (err, resp) => {
        if (resp != null) {
            res.send("Email already exists");
        } else {
            db.collection('users').insertOne(req.body, (err, resp) => {
                session = req.session;
                session.userid = resp.insertedId.toString();
                console.log(req.session);
                res.send(resp.insertedId);
            })
        }
    })
})

app.get('/author/create/:id', (req, res) => {
    db.collection("users").findOne({ _id: ObjectId(req.params.id) }, (err, resp) => {
        res.render('pages/authorCreate.ejs', { user: resp });
    })
})

app.post('/author/create/:id', (req, res) => {
    db.collection("users").updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body }, (err, resp) => {
        res.redirect("/");
    })
})

app.get('/login', (req, res) => {
    if (session.userid) {
        res.send(`You are already login, <a href='/'>go to homepage</a>`);
    } else
        res.render('pages/login.ejs');
})

app.post('/login', (req, res) => {
    db.collection("users").findOne({ email: req.body.email, password: req.body.password }, (err, resp) => {
        if (resp != null) {
            console.log(resp);
            res.send(resp._id.toString());
        } else {
            res.send("Invalid");
        }

    })
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});





app.post('/user', (req, res) => {
    if (req.body.username == demousername && req.body.password == demopasswd) {
        session = req.session;
        session.userid = req.body.username;
        console.log(req.session)
        res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
    }
    else {
        res.send('Invalid username or password');
    }
})




app.get('/pages', (req, resp) => {
    resp.send('ok')
});

app.get('/pages/:pagename', (req, resp) => {
    console.log(`pages/${req.params.pagename}`)
    resp.render(`pages/${req.params.pagename}`)
    
});



/*
app.get('/account/:account', function (req, resp) {
    db.collection('accounts').findOne({ aname: req.params.account }, function (error, res) {
        if (error) resp.send('404 not found');
        else if (res == null) resp.send('Account not found')
        else {
            console.log(res)
            resp.render('pages/account', { account: res })
        }
    })
});

app.get('/account/:account/details', function (req, resp) {
    db.collection('accounts').findOne({ aname: req.params.account }, function (error, res) {
        if (error) resp.send('404 not found');
        else if (res == null) resp.send('Account not found')
        else {
            console.log(res)
            resp.render('pages/details', { account: res })
        }
    })
});
*/
//========================================================================
//API routes start
//========================================================================
app.get("/api", function(req,res){
    db.collection("podcasts").find().sort({_id:-1}).limit(10).toArray(function (error, resp) {
        console.log(resp)
        res.json(resp);
    });
})

app.get("/api/search/keyword/:keyword", function(req,res){
    db.collection("podcasts").find({keywords:req.params.keyword}).sort({_id:-1}).limit(10).toArray(function (error, resp) {
        console.log(resp)
        res.json(resp);
    });
})
app.get("/api/search/date/:month/:day/:year", function(req,res){
    date = `${req.params.month}/${req.params.day}/${req.params.year}`
    db.collection("podcasts").find({publishDate:date}).sort({_id:-1}).limit(10).toArray(function (error, resp) {
        console.log(resp)
        res.json(resp);
    });
})

//========================================================================
//API routes end
//========================================================================
