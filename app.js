const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const fs = require('fs')
const multer = require('multer');
const moment = require('moment')
const filedisk = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'file/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: filedisk })
var app = express();
var schema = mongoose.Schema;

app.use(express.static('public'));

app.use('/file', express.static('file'));

app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost/datasearch", function (err) {
    if (err) {
        console.log("DB Error!")
    }
    else {
        console.log("DB Connect Success!")
    }
})

var FileSchema = new schema({
    filename: {
        type: String
    },
    date : {
        type : String
    },
    kind: {
        type: String
    },
    link: {
        type: String
    }
})

var Files = mongoose.model('file', FileSchema)

app.listen(3000, function (err) {
    if (err) {
        console.log('Server Error!')
        throw err
    }
    else {
        console.log('Server Running At 3000 Port!')
    }
})

app.get('/', function (req, res) {
    res.redirect('/search')
})

app.get('/search', function (req, res) {
    fs.readFile('index.ejs', 'utf-8', function (err, data) {
        res.send(data)
    })
})

app.post('/search', function (req, res) {
    Files.findOne({
        filename: req.param('filename')
    }, function (err, result) {
        if (err) {
            console.log('/search Error!')
            throw err
        }
        else if (result) {
            console.log(result)
            fs.readFile('result.ejs', 'utf-8', function (err, data) {
                res.end(ejs.render(data, {
                    searchfile: req.param('filename'),
                    filename: result.filename,
                    date: result.date,
                    kind: result.kind,
                    link: result.link
                }))
            })
        }
    })
})

app.get('/push', (req, res)=>{
    fs.readFile('push.html', 'utf-8', (err, data)=>{
        res.send(data)
    })
})

app.post('/push', upload.single('file'), function (req, res) {
    const body = req.body;
    const file = req.file;
    const time = moment().format('YYYY년 MM월 DD일, h:mm:ss A');
    console.log(file);
    var push = new Files({
        filename: file.originalname,
        date : time,
        kind: req.param('kind'),
        link: file.path
    })

    push.save(function (err) {
        if (err) {
            console.log('Data Save Error!')
            throw err
        }
        else {
            console.log(req.param('filename') + ' Data Save')
            res.json({
                filename: file.originalname,
                date: time,
                kind: req.param('kind'),
                link: file.path
            })
        }
    })
})
