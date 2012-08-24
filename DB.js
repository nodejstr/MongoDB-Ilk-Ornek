var Db = require('mongodb').Db,
Connection = require('mongodb').Connection,
Server = require('mongodb').Server,
BSON = require('mongodb').BSON,
GridStore = require('mongodb').GridStore,
ObjectID = require('mongodb').ObjectID;

DB = function(host, port) {
    this.server = new Server(host, port, { auto_reconnect: true });
    this.db = new Db('nodejstr-blog', this.server);
    this.db.open(function(err, db) {
        if(!err) {
            console.log("DB is ready for dogfight at port " + port);
        }
    });
};

DB.prototype.getCollection = function(callback) {
    this.db.collection('posts', function(error, post_collection) {
        if(error)
            callback(error);
        else
            callback(null, post_collection);
    });
};

DB.prototype.findAll = function(callback) {
    this.getCollection(function(error, post_collection) {
        if(error)
            callback(error)
        else {
            post_collection.find().toArray(function(error, results) {
                if(error)
                    callback(error)
                else
                    callback(null, results)
            });
        }
    });
};

DB.prototype.findById = function(id, callback) {
    this.getCollection(function(error, post_collection) {
        if(error)
            callback(error)
        else {
            post_collection.findOne({
                _id: post_collection.db.bson_serializer.ObjectID.createFromHexString(id)
            }, function(error, result) {
                if(error)
                    callback(error)
                else
                    callback(null, result)
            });
        }
    });
};

DB.prototype.save = function(posts, callback) {
    this.getCollection(function(error, post_collection) {
        if(error)
            callback(error);
        else {
            if(typeof (posts.length) == "undefined")
                posts = [posts];
            for(var i = 0; i < posts.length; i++) {
                post = posts[i];
                post.id = new ObjectID();
                if(post.created_at === undefined)
                    post.created_at = new Date();
            }
            post_collection.insert(posts, function() {
                callback(null, posts);
            });
        }
    });
};

exports.DB = DB;