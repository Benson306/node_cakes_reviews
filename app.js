let express = require('express');
const { render, redirect } = require('express/lib/response');

let app = express();



//set views
app.set('view engine', 'ejs');

//set static files
app.use(express.static('./public'));

//body-parse for post
let bodyParser = require('body-parser');
const res = require('express/lib/response');
let urlencodedParser = bodyParser.urlencoded({extended: false});


//mongoose
let mongoose = require('mongoose');
//connect to do
mongoose.connect('mongodb+srv://benson306:benson306@bencluster.axe8t.mongodb.net/cakes?retryWrites=true&w=majority');

let cakesSchema = new mongoose.Schema({
    email: String,
    subject: String,
    message: String
});

let Cakes = mongoose.model('reviews', cakesSchema); //reveiews is the collection in the DB

//method override - npm install method-override
let methodOverride = require('method-override');
app.use(methodOverride('_method'));



app.get('/', function(req, res){
    res.render('index');
});


app.get('/index', function(req, res){
    res.render('index');
});

app.get('/contact', function(req, res){
    res.render('contact');
});

app.get('/about', function(req, res){
    res.render('about');
});

//get messages from DB
app.get('/messages', function(req, res){
    Cakes.find({}, function(err, data){
        if(err) throw err;
        res.render('messages', {reviews: data});
    })
    
});


//posting

app.post('/contact', urlencodedParser, function(req, res){
    let newCakes = Cakes(req.body).save(function(err, data){
        if(err) throw err;
        res.render('success',{data: req.body});
    })
    
});

//edit
app.get('/messages/edit/:id', function(req,res){
    const id = req.params.id;
    Cakes.findById(id, function(err, data){
        if(err) throw err();
        res.render('edit_form', {data: data})
    }) 
});

app.put('/messages/edit/:id', urlencodedParser, function(req, res){
  const id = req.params.id;
    Cakes.findByIdAndUpdate(id, {email: req.body.email, subject: req.body.subject, message: req.body.message }, {new: true}, function(err, data){
        if(err) throw err();
        res.redirect('/messages');
    })  
})


//delete
app.delete('/messages/:id', function(req, res){
    Cakes.find({_id:req.params.id}).deleteOne(function(err, data){
                if(err) throw err;
                res.redirect('/messages');
    });
});

app.listen(3000);