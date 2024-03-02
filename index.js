const express = require('express')
const app = express()
const port = 3000


const bodyParser = require('body-parser');

const loginRoutes=require('./routes/loginRoutes.js')


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/',loginRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})