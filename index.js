var express=require('express')
const app=express();
//body parser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//for mongodb
const MongoClient=require('mongodb').MongoClient;
//const MongClient=require('./server');
let server=require('./server');
//let config=require('./config');
let middleware=require('./middleware');
//const response=require('express');
//const { homedir } = require('os');
//const { readdirSync } = require('fs');
//database connection
const url='mongodb://127.0.1:27017';
const dbname= 'hospital';
let db
MongoClient.connect(url, { useUnifiedTopology: true },(err, client) => {
  if (err) return console.log(err);
  db=client.db(dbName);
  console.log(`connected MongoDB :${url}`);
  console.log(`Database:${dbName}`);
   
})
//fetching hospital details
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("fetching data from hopital collection");
    var data =db.collection('hospitaldetails').find().toArray()
        .then(result=> res.json(result));

});

//ventilator details
app.get('/hospitaldetails',middleware.checkToken,(req,res) => {
    console.log("ventilators information");
    var ventilatordetails =db.collection('ventilators').find().toArray()
        .then(result=> res.json(result));
});

//search ventilators by status
app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
    var status = req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilators')
    .find({"status":status}).toArray().then(result=> res.json(result));
});

//search ventilators by hospital name
app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
    var name = req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilators')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=> res.json(result));
});

//search hospital by name
app.post('/searchhospital',middleware.checkToken,(req,res)=>{
    var name= req.query.name;
    console.log(name);
    var hospitaldetails=db.collection('hospitaldetails')
    .find({'name':new RegExp(name,'i')}).toArray().then(result => res.json(result));
});

//update ventilator details
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={ventilatorid:req.body.ventilatorid};
    console.log(ventid);
    var newvalues= {$set:{status:req.body.status}};
    db.collection("ventilators").updateOne(ventid,newvalues,function(err,result){
        res.json('1 document updatted');
        if(err) throw err;
        
    });
});
    //add  ventilator
    app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
        var hid=req.body.hid;
        var ventilatorid=req.body.ventilatorid;
        var status=req.body.status;
        var name =req.body.name;
    var item=
    {
        hid:hid,ventilatorid:ventilatorid,status:status,name:name
    };
    db.collection('ventilators').insertOne(item,function(err,result){
        res.json('item inserted');
    });
    });
//delete ventilator by ventilatorid
app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.ventilatorid;
    console.log(myquery);
    var myquery1={ventilatorid:myquery};
    db.collection('ventilators').deleteOne(myquery1,function(err,obj)
    {
        if(err) throw err;
        res.json("1 documeny deleted");
        });

});

app.listen(700)