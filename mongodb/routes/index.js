const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const url = 'mongodb://127.0.0.1:27017/test';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/get-data', function (req, res, next) {
    const resultArray = [];
    mongo.connect(url, function (err, db) {
        assert.strictEqual(null, err);
        const cursor = db.collection('user-data').find();
        cursor.forEach(function (doc, err) {
            assert.strictEqual(null, err);
            resultArray.push(doc);
        }, function () {
            db.close();
            res.render('index', {items: resultArray})
        })
    })
});

router.post('insert', function (req, res, next) {
    const item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    mongo.connect(url, function (err, db) {
        assert.strictEqual(null, err);
        db.collection('user-data').insertOne(item, function (err, result) {
            assert.strictEqual(null, err);
            console.log('Item inserted.');
            db.close()
        })
    });

    res.redirect('/')
});

router.post('update', function (req, res, next) {

});

router.post('delete', function (req, res, next) {

});

module.exports = router;
