var express = require('express'),
app = express(),
post = require('./models/post.js')
DB = require('./DB.js').DB;

app.listen(3000);
var db = new DB('localhost', 27017);

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

app.get('/', function(req, res) {

    db.findAll(function(errf, posts) {
        if(errf) {
            console.log("Failed to get posts " + errf);
            res.send(JSON.stringify({
                meta: {
                    errorCode: 1,
                    errorMessage: errf
                }
            }));
        }
        console.log(posts);
        res.render('index', { data: posts.reverse() });
    });

});

app.post('/create', function(req, res, next) {
    var post1 = new post({ baslik: req.body.baslik, icerik: req.body.icerik });
    db.save(post1, function(errf, post) {
        if(errf)
            console.log('Failed to save ' + errf);
        else
            console.log(post);
    });
    res.redirect("back");
});

console.log('Server started at port ' + 3000);