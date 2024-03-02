const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var mysql = require('mysql');
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




exports.home = (req, res) => {
    res.render('index', { message:"" })
}

exports.signup = (req, res) => {
    const { username, password, email } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            res.send('Error signing up' + err.message);
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
                    res.render('index', { message:"signed up sucess" })
                }
            });
        }
    });
}

exports.signin = (req, res) => {

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
                        // Record unsuccessful login attempt
                        db.query('INSERT INTO login_activities (user_id, timestamp, successful) VALUES (?, ?, ?)', [result[0].id, new Date(), 0]);
                        res.send('Invalid username or password');
                    } else {
                        // Record successful login attempt
                        db.query('INSERT INTO login_activities (user_id, timestamp, successful) VALUES (?, ?, ?)', [result[0].id, new Date(), 1]);

                        // Create a JWT
                        const token = jwt.sign({ username: result[0].username }, 'your_secret_key', { expiresIn: '1h' });
                        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration
                        db.query(`SELECT * FROM login_activities WHERE user_id=${result[0].id};`, (err, record) => {
                            if (err) {
                                console.log('no login details found for user')
                            }
                            else {
                                // Render the dashboard page
                                res.render('dashboard', { title: 'Dashboard', name: result[0], loginRecord: record });
                            }
                        })

                    }
                });
            } else {
                res.send('Invalid username or password');
            }
        }
    });
}

exports.logout = (req, res) => {
    // Clear the JWT cookie
    res.clearCookie('token');
    res.redirect('/'); // Redirect to the home page or any other page
}