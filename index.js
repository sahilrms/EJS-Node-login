const express = require('express')
const app = express()
const port = 3000
var mysql = require('mysql');
const dbConnect = require('./dbConnect');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var db = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "sahil",
    password: "JK02bb8911",
    database: "auth"

});

db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render('index');
})

// Sign up route
app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;
  
    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        res.send('Error signing up'+err.message);
      } else {
        const user = { username, password: hashedPassword, email };
  
        db.query('INSERT INTO users SET ?', user, (err, result) => {
          if (err) {
            res.send('Error signing up');
          } else {
            // Create a JWT
            const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration
            // res.send('Signed up successfully');
            res.render('dashboard', { title: 'Home', name: username })
          }
        });
      }
    });
  });
  
// Sign in route
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
  
    // Retrieve the user from the database
    db.query('SELECT * FROM users WHERE email = ?', email, (err, result) => {
      if (err) {
        res.send('Error signing in');
      } else {
        if (result.length > 0) {
          // Compare the hashed password with the provided password
          bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err || !isMatch) {
              res.send('Invalid username or password');
            } else {
              // Create a JWT
              const token = jwt.sign({ username: result[0].username }, 'your_secret_key', { expiresIn: '1h' });
              res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration
            //   res.render('');
              res.render('dashboard', { title: 'Home', name: email })
            //   res.send('Signed in successfully');
            }
          });
        } else {
          res.send('Invalid username or password');
        }
      }
    });
  });
  

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})