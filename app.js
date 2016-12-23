var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express();
var schema = mongoose.Schema;

app.use(bodyParser.urlencoded({
  extended : true;
}))

mongoose.connect("mongodb://localhost/datasearch", function(err){
  if(err){
    console.log("DB Error!")
  }
  else {
    console.log("DB Connect Success!")
  }
})

var FileSchema = new schema({
  filename : {
    type : String
  },
  date : {
    type : String
  },
  link : {
    type : String
  }
})

var Files = mongoose.model('file', FileSchema)

app.listen(3000, function(err){
  if(err){
    console.log('Server Error!')
    throw err
  }
  else {
    console.log('Server Running At 3000 Port!')
  }
})

app.post('/search', function(req, res){
  Files.findOne({
    filename : req.param('filename')
  },function(err, result){
    if(err){
      console.log('/search Error!')
      throw err
    }
    else if(result){
      res.json(result)
    }
  })
})
