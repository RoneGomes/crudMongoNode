const express=require('express')
const app = express()
app.set('view ingine ','ejs')
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extends:true}))


//inicio da configuração do mongoDB

const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

const caminho = "mongodb://localhost/Escola"

MongoClient.connect(caminho,{useNewUrlParser: true, useUnifiedTopology: true},(err, client) => {

    db = client.db('Escola') // Busncando no sevidor MongoDB o banco Escola

})



// metodo inicial
app.get('/',(req,res)=>{

    res.render('index.ejs')

})

// metodos para inserir dados nos bancos

app.post('/show', (req, res) => {
    db.collection('data').insertOne(req.body, (err, result) => {  
        res.redirect('/show')
    })
})

//metodo de deletar no banco
app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {

        res.render('show.ejs', { data: results })

    })
})

// ============================  ATUALIZA REGISTRO ==================================

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname

  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})


app.listen(3000,function(){
    console.log('Serve rodando na porta 3001')
})