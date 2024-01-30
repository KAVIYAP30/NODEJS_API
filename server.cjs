const express = require('express')
const bodyParser = require('body-parser')
const {connectToDb,getDb} = require('./db.cjs')
const {ObjectId} =require('mongodb')
const app = express()
let db
app.use(express.static(__dirname))
app.use(bodyParser.json())

connectToDb(function(error){
    if(!error){
        app.listen(2024)
        db= getDb()
        console.log(db)

    }
    else{
        console.log(error)
    }
})


app.get('/get-data', function(request, response) {
    const entries = []
    db.collection('api')
    .find()
    .forEach(entry => entries.push(entry))
    .then(function() {
        response.status(200).json(entries)
    }).catch(function(error) {
        response.status(404).json({
            'error' : error
        })
    })
})

app.delete('/delete-entry', function(request, response) {
    
    if(ObjectId.isValid(request.body.id)){
        db.collection('api').deleteOne({
            _id : new ObjectId(request.body.id)
        }).then(function() {
            response.status(201).json({
                'status' : 'data successfully deleted'
            })
        }).catch(function(error) {
            response.status(500).json({
                'error' : error
            })
        })
    } else {
        response.status(500).json({
            'status' : 'ObjectId not valid'
        })
    }
})


app.post('/add-rec', function(request, response) 
{
    db.collection('date')
    .insertOne(request.body).then(function() {
        response.status(201).json({
            'status' : 'data successfully entered'
        })
    }).catch(function(error) {
        response.status(500).json({
            'error' : error
        })
    })
})
