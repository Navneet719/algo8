const express =require('express');
const mongoose =require('mongoose');
const route =require('./route/route');


const app= express()

app.use(express.json())


mongoose.connect("mongodb+srv://navneet:Navneet719@cluster0.3oclrwu.mongodb.net/algo8?retryWrites=true&w=majority", { useNewUrlParser: true })
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route)

app.use((req, res, next) => {
    const error = new Error('/ Path not found /');
    return res.status(400).send({ status: 'ERROR', error: error.message })
});

app.listen(process.env.PORT || 3010, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3010))})
