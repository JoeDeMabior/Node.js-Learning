const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/get-data', function(req, res, next) {
    const resultArray = [];
    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        const dbName = client.db('test');
        const cursor = dbName.collection('user-data').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            client.close();
            res.render('index', {items: resultArray});
        });
    });
});

router.post('/insert', function(req, res, next) {
    const item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        const dbName = client.db('test');
        dbName.collection('user-data').insertOne(item, function(err, result) {
            assert.equal(null, err);
            console.log('Item inserted');
            client.close();
        });
    });

    res.redirect('/');
});

router.post('/update', function(req, res, next) {
    const item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    const id = req.body.id;

    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        const dbName = client.db('test');
        dbName.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
            assert.equal(null, err);
            console.log('Item updated');
            client.close();
        });
    });
});

router.post('/delete', function(req, res, next) {
    const id = req.body.id;

    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        const dbName = client.db('test');
        dbName.collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
            assert.equal(null, err);
            console.log('Item deleted');
            client.close();
        });
    });
});

module.exports = router;
