const express = require('express')
const app = express()
const date = new Date()
const dateFormatter = require('date-format-conversion')
const Users = require('./models/users')
const Entry = require('./models/entry')

app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/MyDiary', {
    useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error)=>console.error(error))
db.once('open', ()=>console.log("Connected to database"))

app.get('/', async (req,res)=>{
    const status = req.query.valid
    if(status == 'done'){
        res.render('menu.ejs', { status : true })
    }
    else if(status == 'success'){
        res.render('menu.ejs', { status : false })
    }
    else {
        res.render('menu.ejs', { status : null })
    }
})

app.get('/about', (req,res)=>{
    res.render('about')
})

app.get('/contact', (req,res)=>{
    res.render('contact')
})

app.get('/today', async (req,res)=>{
    const message = req.query.valid
    const displayDate = await dateFormatter(date.toISOString().slice(0,10) , 'dd-MM-yyyy')
    if(message == 'success'){
        res.render('today.ejs', { contents : null, status : false, date : displayDate, readonly : true})
    }
    else if( await Entry.findOne({ entryDate : displayDate })) {
        res.render('today.ejs', { contents: !null, status : true, date : displayDate, readonly : true })
    } 
    else {
    res.render('today.ejs', { contents : null, status : null, date : displayDate, readonly : false  })
    }
})

app.post('/after', async (req,res)=>{
    try{
        await Entry.create({
            entryDate: await dateFormatter(date.toISOString().slice(0,10) , 'dd-MM-yyyy'),
            description: req.body.entry
        })
        res.redirect('/today?valid=success')
    } catch(err){
        res.send("Unable to process request.")
    }
})

app.get('/records', async (req,res)=>{
    const entries = await Entry.find()
    res.render('records.ejs', { entries : entries })
})

app.get('/records/:id', async (req,res)=>{
    const entry = await Entry.findById(req.params.id)
    res.render('today.ejs', { status : null, contents : entry, date : entry.entryDate, readonly : true })
})

app.get('/delete/:id', async (req,res)=>{
    await Entry.findByIdAndDelete(req.params.id)
    res.redirect('/records')
})

app.listen(3500, ()=>console.log("Server started."))