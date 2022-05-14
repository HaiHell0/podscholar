const MongoClient = require('mongodb').MongoClient;
const express = require('express')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const ObjectId = require("mongodb").ObjectId;
var app = express();


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

app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.set('view engine', 'ejs');
var session;
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.listen(PORT, function () {
    console.log(`App is listening on port ${PORT}`)
})
app.use(express.static(__dirname));



app.get('/', (req, res) => {
    res.render("pages/index.ejs");
});
app.get('/pages', (req, resp) => {
    resp.send('ok')
});
app.get('/pages/:pagename', (req, resp) => {
    console.log(`pages/${req.params.pagename}`)
    resp.render(`pages/${req.params.pagename}`)
});

app.get('/pages/static/:pagename', (req, resp) => {
    console.log(`pages/static/${req.params.pagename}`)
    resp.render(`pages/static/${req.params.pagename}`)

});


//podcast route
app.get("/pages/podcasts/:id", function (req, res) {
    res.render("pages/podcasts", { data: req.params.id });
})


//keywords route
app.get('/pages/keywordTag/:tag', (req, res) => {
    res.render("pages/keywordTag", { data: req.params.tag })
})
//category route
app.get('/pages/categoryTag/:tag', (req, res) => {
    res.render("pages/categoryTag", { data: req.params.tag })
})

app.get('/pages/podcasts/:tag', (req, res) => {
    res.render("pages/podcasts", { data: req.params.tag })
})

//AUTHENTICATION
app.get('/auth/signup', (req, res) => {
    if (req.session.userid) {
        res.send("You are already signed up, <a href=\'/'>click here to go homepage</a>");
    } else
        res.render('pages/register.ejs');
})

app.get('/auth/signin', (req, res) => {
    if (req.session.userid) {
        res.send(`You are already signed in, <a href='/'>click here go to homepage</a>`);
    } else
        res.render('pages/login.ejs');
})

app.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})


//AUTHOR ACCOUNT APPROVAL
app.get('/authors/create', (req, res) => {
    if (req.session.userid) {
        db.collection("users").findOne({ _id: ObjectId(req.session.userid) }, (err, resp) => {
            res.render('pages/authorCreate.ejs', { user: resp });
        })
    } else
        res.send(`You have not signed up yet, <a href='/auth/signup'>click here go to sign up</a>`)

})

//USER/AUTHOR PROFILE
app.get('/users/:id', (req, res) => {
    db.collection("users").findOne({ _id: ObjectId(req.params.id) }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else {
            res.render('pages/user.ejs', { user: resp });
        }
    })
})

app.get('/account', (req, res) => {
    if (req.session.userid) {
        db.collection("users").findOne({ _id: ObjectId(req.session.userid) }, (err, resp) => {
            if (err) {
                res.send("Error");
            } else {
                res.render('pages/account.ejs', { user: resp });
            }
        })
    } else
        res.send(`You have not signed in yet, <a href='/auth/signin'>click here go to sign in</a>`)
})

app.get('/account/details', (req, res) => {
    if (req.session.userid) {
        db.collection("users").findOne({ _id: ObjectId(req.session.userid) }, (err, resp) => {
            if (err) {
                res.send("Error");
            } else {
                res.render('pages/accountDetails.ejs', { user: resp });
            }
        })
    } else
        res.send(`You have not signed in yet, <a href='/auth/signin'>click here go to sign in</a>`)
})

app.get('/account/settings', (req, res) => {
    if (req.session.userid) {
        db.collection("users").findOne({ _id: ObjectId(req.session.userid) }, (err, resp) => {
            if (err) {
                res.send("Error");
            } else {
                res.render('pages/accountSettings.ejs', { user: resp });
            }
        })
    } else
        res.send(`You have not signed in yet, <a href='/auth/signin'>click here go to sign in</a>`)
})

app.get('/users/:id/podcasts/authored', (req, res) => {
    //return a page displaying the user's uploadedPodcasts
    res.render("pages/userPodcasts.ejs", { page: "Uploaded Podcasts", id: req.params.id })
})

app.get('/users/:id/podcasts/saved', (req, res) => {
    //return a page displaying the user's savedPodcasts
    res.render("pages/userPodcasts.ejs", { page: "Saved Podcasts", id: req.params.id })
})

app.get('/users/:id/podcasts/liked', (req, res) => {
    //return a page displaying the user's savedPodcasts
    res.render("pages/userPodcasts.ejs", { page: "Liked Podcasts", id: req.params.id })
})




//========================================================================
//API routes start
//========================================================================
app.get("/api", function (req, res) {
    db.collection("podcasts").find().sort({ _id: -1 }).limit(10).toArray(function (error, resp) {
        console.log(resp)
        res.json(resp);
    });
})

app.get("/api/podcast/search/:id", function (req, res) {
    db.collection("podcasts").find({$or:[{ id: parseInt(req.params.id) },{ _id: (new ObjectId(String(req.params.id)))}]}).toArray(function (error, resp) {
        res.json(resp);
    })
})



app.get("/api/search/keyword/:keyword", function (req, res) {
    db.collection("podcasts").find().sort({ _id: -1 }).limit(10).toArray(function (error, resp) {
        keyword = req.params.keyword;
        let results = [];
        resp.forEach((podcast) => {
            if (
                podcast.keywords.includes(keyword) || podcast.title.split(" ").includes(keyword) || podcast.authors.includes(keyword) || podcast._id == keyword
            ) results.push(podcast);
        })
        //console.log(results)
        res.json(results);
    });
})
app.get("/api/search/date/:month/:day/:year", function (req, res) {
    date = `${req.params.month}/${req.params.day}/${req.params.year}`
    db.collection("podcasts").find({ publishDate: date }).sort({ _id: -1 }).limit(10).toArray(function (error, resp) {
        console.log(resp)
        res.json(resp);
    });
})

app.get("/api/categories", async function (req, res) {
    array = [];
    const pipeline = [
        { $group: { _id: "$journal", count: { $sum: 1 } } }
    ];
    const aggCursor = await db.collection("podcasts").aggregate(pipeline);
    for await (doc of aggCursor) {
        array.push(doc)
    }
    console.log(array)
    res.json(array)
    //res.render("pages/test",{data:disciplineArray});
})


app.get("/api/categories/:scientificdiscipline", function (req, res) {
    db.collection("podcasts").find({ journal: req.params.scientificdiscipline }).sort({ _id: -1 }).limit(10).toArray(function (error, resp) {
        console.log(resp);
        res.json(resp);
    })
})
app.get("/api/categories/:scientificdiscipline/search/date/:month/:day/:year", function (req, res) {
    date = `${req.params.month}/${req.params.day}/${req.params.year}`
    db.collection("podcasts").find({ journal: req.params.scientificdiscipline, publishDate: date }).sort({ _id: -1 }).limit(10).toArray(function (error, resp) {
        console.log(resp);
        res.json(resp);
    })
})

app.get("/api/keywords", async function (req, res) {
    array1 = [];
    const pipeline1 = [
        { $unwind: "$keywords" },
        { $group: { _id: "$keywords", count: { $sum: 1 } } }
    ];
    const aggCursor1 = await db.collection("podcasts").aggregate(pipeline1);
    for await (doc of aggCursor1) {
        array1.push(doc)
    }
    console.log(array1)
    res.json(array1)
    //res.render("pages/test",{data:disciplineArray});
})
app.get("/api/keywords/:keyword", function (req, res) {
    db.collection("podcasts").find({ keywords: req.params.keyword }).sort({ _id: -1 }).limit(10).toArray(function (error, resp) {
        console.log(resp);
        res.json(resp);
    })
})

app.get("/api/keywords/:keyword/search/date/:month/:day/:year", function (req, res) {
    date = `${req.params.month}/${req.params.day}/${req.params.year}`
    db.collection("podcasts").find({ keywords: req.params.scientificdiscipline, publishDate: date }).sort({ _id: -1 }).limit(10).toArray(function (error, resp) {
        console.log(resp);
        res.json(resp);
    })
})



//AUTHENTICATION
//create an account
app.post('/api/auth/signup', (req, res) => {
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

//log in into an account
app.post('/api/auth/signin', (req, res) => {
    db.collection("users").findOne({ email: req.body.email, password: req.body.password }, (err, resp) => {
        if (resp != null) {
            session = req.session;
            session.userid = resp._id.toString();
            console.log(req.session);
            res.send(resp._id.toString());
        } else {
            res.send("Invalid");
        }

    })
})

//AUTHOR ACCOUNT APPORVAL
//create an author account
app.post('/api/authors/create/:id', (req, res) => {
    db.collection("users").updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body }, (err, resp) => {
        res.send("You are approved as author of PodScholar! You now can upload your podcast. <a href='/'>click here to go to homepage</a>");
    })
})

//USER/AUTHOR PROFILE
//retrieve a user profile
app.get('/api/users/:id', (req, res) => {
    db.collection("users").findOne({ _id: ObjectId(req.params.id) }, (err, resp) => {
        if (resp != null) {
            res.send(resp);
        } else {
            res.send("Can not find user");
        }
    })
})

//ACCOUNT
//Retrieves account information for the current user
app.get('/api/account/:id', (req, res) => {
    db.collection("users").findOne({ _id: ObjectId(req.params.id) }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else {
            res.send(resp);
        }
    })
})

//Edits account information for the current user
app.post('/api/account/:id', (req, res) => {
    db.collection("users").updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else
            res.send("account updated");
    })
})

//FOLLOW FEATURE
//Get if a user is following another user
app.get('/api/users/:id/actions/follow', (req, res) => {
    console.log(req.session);
    if (req.session.userid == req.params.id) {
        res.send("Same user");
    } else {
        db.collection("users").findOne({ _id: ObjectId(req.session.userid), "following": req.params.id }, (err, resp) => {
            if (resp != null) {
                res.send("Yes");
            } else {
                res.send("No");
            }
        })
    }
})

//Follows a user
app.post('/api/users/:id/actions/follow', (req, res) => {
    db.collection("users").updateOne({ _id: ObjectId(req.session.userid) }, { $push: { "following": req.params.id } }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else {
            db.collection("users").updateOne({ _id: ObjectId(req.params.id) }, { $push: { "followers": req.session.userid } }, (err, resp) => {
                if (err) {
                    res.send("Error");
                } else {
                    res.send("Success")
                }
            });
        }
    })
})

//Unfollow a user
app.post('/api/users/:id/actions/unfollow', (req, res) => {
    db.collection("users").updateOne({ _id: ObjectId(req.session.userid) }, { $pull: { "following": req.params.id } }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else {
            db.collection("users").updateOne({ _id: ObjectId(req.params.id) }, { $pull: { "followers": req.session.userid } }, (err, resp) => {
                if (err) {
                    res.send("Error");
                } else {
                    res.send("Success")
                }
            });
        }
    })
})

//UPLOAD PODCAST FEATURE
//Retrieves all the uploaded podcasts from a user
app.get('/api/users/:id/podcasts/authored', (req, res) => {
    db.collection("users").findOne({ _id: ObjectId(req.params.id) }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else
            res.send(resp.uploadedPodcast);
    })
})



//user deletes an uploaded podcast
app.post('/api/account/delete/:podcastId', (req, res) => {
    db.collection("users").updateOne({ _id: ObjectId(req.session.userid) }, { $pull: { "uploadedPodcast": req.params.podcastId } }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else
            res.send("podcast deleted!");
    })
})


//SAVE PODCAST FEATURE
//Retrieves all the podcasts saved by a user
app.get('/api/users/:id/podcasts/saved', (req, res) => {
    db.collection("users").findOne({ _id: ObjectId(req.params.id) }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else
            res.send(resp.savedPodcast);
    })
})

//user saves a podcast
app.post('/api/users/actions/save/:id', (req, res) => {
    db.collection("users").updateOne({ _id: ObjectId(req.session.userid) }, { $push: { "savedPodcast": req.params.id } }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else
            res.send("podcast saved!");
    })
})

//user unsaves a podcast
app.post('/api/users/actions/unsave/:id', (req, res) => {
    db.collection("users").updateOne({ _id: ObjectId(req.session.userid) }, { $pull: { "savedPodcast": req.params.id } }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else
            res.send("podcast unsaved!");
    })
})

//LIKE PODCAST FEATURE
//Retrieves all the podcasts liked by a user
app.get('/api/users/:id/podcasts/liked', (req, res) => {
    db.collection("users").findOne({ _id: ObjectId(req.params.id) }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else
            res.send(resp.likedPodcast);
    })
})

//user likes a podcast
app.post('/api/users/actions/like/:id', (req, res) => {
    db.collection("users").updateOne({ _id: ObjectId(req.session.userid) }, { $push: { "likedPodcast": req.params.id } }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else {
            res.send("podcast liked!");
        }
    })
})

//user unlikes a podcast
app.post('/api/users/actions/unlike/:id', (req, res) => {
    db.collection("users").updateOne({ _id: ObjectId(req.session.userid) }, { $pull: { "likedPodcast": req.params.id } }, (err, resp) => {
        if (err) {
            res.send("Error");
        } else
            res.send("podcast unliked!");
    })
})


//api routes for podcast
app.post('/api/podcast/upload', (req, res) => {
    db.collection('podcasts').insertOne(req.body, (err, resp) => {
        console.log(err)
        console.log(req.body)
        res.sendStatus(200);
    })
})


//========================================================================
//API routes end
//========================================================================

//TO BE FINISHED
//user uploads a podcast
app.get('/api/account/upload/:DOI', (req, res) => {
    db.collection("podcasts").findOne({doi:req.params.DOI}, (err, resp) => {
        if (err) {
            res.send("Error");
        } else
            console.log(req.session.userid)
            db.collection("users").updateOne({_id: ObjectId(req.session.userid)}, (err,resp)=>{
            })
            res.send(resp);
    })
})