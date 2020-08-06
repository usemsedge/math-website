"use strict";

const today = new Date();
function get_full_time() {
    return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}, ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
}

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const url = require('url');
const nodemailer = require('nodemailer');
const fs = require("fs");

//const { response } = require('express');
//const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const email_regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
//const user_regex = 

const ADMIN_PASSWORD = 'admin';
const ADMIN_USERNAME = 'admin';
const MY_EMAIL = "noreply3298@gmail.com"; // the email youre sending stuff from
const MY_PASSWORD = "averysimplepassword1"; // the password to the email above
//suggested to make this email a disposable alt, this way the password doesn't matter

let app = express();

app.use(bodyParser.text({type: 'text/html'}));
app.use(express.static(path.join(__dirname, '/assets')));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/', function(request, response) {
    response.sendFile(path.join(`${__dirname}/login.html`));
});


app.get('/register', function(request, response) {
    response.sendFile(path.join(`${__dirname}/register.html`));
});

/**
 * registers a user with request.body.username, request.body.password, and request.body.email
 * if registering is successful, makes a new user in stats.json and list.json
 */
app.post('/reg', function(request, response) {
    const username = request.body.username.toLowerCase();
    const password = request.body.password;
    const password2 = request.body.password2;
    const email = request.body.email;

    console.log(` >>> ${username} registered with a password of ${password} and email ${email} at ${get_full_time()} <<< `);
    
    const contents = JSON.parse(fs.readFileSync("list.json"));
    if (username && password && password2 && email) {
        if (!email.match(email_regex)) {
            response.send("Invalid Email");
            return;
        }

        /*
        TODO: make user regex work
        if (!username.match(user_regex)) {
            response.send("Invalid Username");
            return;
        }*/

        if (password !== password2) {
            response.send("Passwords do not match");
            return;
        }        
        if (username === ADMIN_USERNAME) {
            response.send("Username is Taken Already");
        }
        if (contents[username]) {
            //username has been taken
            response.send("Username is Taken Already");    
            return;
        }
        if (username.length < 3 || username.length > 50) {
            response.send("Username must be between 3 and 50 characters");
            return;
        }
        if (!username[0].match(/^[0-9a-z]+$/i)) {
            response.send("Username must begin with an alphanumeric character");
            return;
        }

        //create the new account with password
        contents[username] = [password, email];
        fs.writeFileSync("list.json", JSON.stringify(contents));

        //set the stats
        let k = JSON.parse(fs.readFileSync('stats.json'));
        k[username] = {"fractions":0, "lcm":0, "pf":0, "square":0, "square5":0, "square5reverse":0,
                       "fractions_in":0, "lcm_in":0, "pf_in":0, "square_in":0, 
                       "square5_in":0, "square5reverse_in":0};
        fs.writeFileSync('stats.json', JSON.stringify(k));
        response.redirect('/');
        return;
    }
    response.send("Please enter Usernsme and/or Password!");
});

/**
 * a user tries to log in
 * if they are the admin, let them see the email page
 * else, let them see the main hub
 */
app.post('/auth', function(request, response) {
    const username = request.body.username.toLowerCase();
    const password = request.body.password;
    if (username && password) {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            request.session.loggedin = true;
            request.session.username = ADMIN_USERNAME;
                //admins can see the email thig
            response.redirect('/email');
            console.log(` >>> Admin logged in at ${get_full_time()} <<< `);
            return;
        }
        const contents = JSON.parse(fs.readFileSync("list.json"));
        try {
            if (contents[username][0] == password) {
                request.session.loggedin = true;
                request.session.username = username;
                console.log(` >>> User ${request.session.username} logged in at ${get_full_time()} <<< `);
                response.redirect('/dashboard');
                return; 
            }
        }
        catch (error) {
            response.send('Incorrect Username and/or Password!');
            response.end();
            return;
        }
        response.send('Incorrect Username and/or Password!');
        response.end();
        return;
    } else {
        response.send('Please enter Username and/or Password!');
        response.end();
        return;
    }
});

/**
 * 
 * @param {Object} contents a json file contaning all emails
 * @param {string} email the email to send messages from
 * @param {string} password the password to the above email
 * @param {string} subject The subject line in all emails
 * @param {string} text The text to send all emails
 */

function send_mail_to_all(contents, email, password, subject, text) {
    for (let key in contents) {
        let value = contents[key];
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: email,
            pass: password
            }
        });
        
        let mailOptions = {
            from: email,
            to: value[1],
            subject: subject,
            text: text
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.error(error);
            } else {
            console.log(`Email sent: ${info.response}`);
            }
        });
    }
}

/**
 * sends an email to everyone that is registered
 */

app.get('/email', function(request, response) {
    //only admin can use tis
    if (request.session.username == 'admin') {
        if (request.url !== '/email') {
            const query = url.parse(request.url, true).query;
            const subject = query['subject'];
            const text = query['text'];


            const contents = JSON.parse(fs.readFileSync('list.json'));

            send_mail_to_all(contents, MY_EMAIL, MY_PASSWORD, subject, text);
        }
        response.sendFile(`${__dirname}/admin.html`);
    }
    else {
        response.send('You are not authorized to use this');
    }
});

/**
 * dashboard stuff is self explanatory
 */
app.get('/dashboard', function(request, response) {
    response.sendFile(`${__dirname}/dashboard.html`);
});

/**
 * dashboard.js will call this
 */
app.get('/dashboard_data', function(request, response) {
    const stats = JSON.parse(fs.readFileSync('stats.json'));
    response.send(stats);
});

app.get('/mathlcm', function(request, response) {
    if (request.session.loggedin) {
        let x = fs.readFileSync('least_common_multiple.html').toString();
        x = x.replace(`id="username">`, `id="username">${request.session.username}`);
        
        response.send(x);
    }
    else {
        response.sendFile(`${__dirname}/please_log_in.html`)
    }
});

app.get('/mathpf', function(request, response) {
    if (request.session.loggedin) {
        let x = fs.readFileSync('prime_factorization.html').toString();
        x = x.replace(`id="username">`, `id="username">${request.session.username}`);
        
        response.send(x);
    }
    else {
        response.sendFile(`${__dirname}/please_log_in.html`)
    }
});

app.get('/mathfractions', function(request, response) {
    if (request.session.loggedin) {
        let x = fs.readFileSync('add_fractions.html').toString();
        x = x.replace(`id="username">`, `id="username">${request.session.username}`);
        
        response.send(x);
    }
    else {
        response.sendFile(`${__dirname}/please_log_in.html`);
    }
});

app.get('/mathsquare', function(request, response) {
    if (request.session.loggedin) {
        let x = fs.readFileSync('squares.html').toString();
        x = x.replace(`id="username">`, `id="username">${request.session.username}`);
        
        response.send(x);
    }
    else {
        response.sendFile(`${__dirname}/please_log_in.html`);
    }
})

app.get('/math5square', function(request, response) {
    if (1 || request.session.loggedin) {
        let x = fs.readFileSync('square5.html').toString();
        x = x.replace(`id="username">`, `id="username">${request.session.username}`);
        
        response.send(x);
    }
    else {
        response.sendFile(`${__dirname}/please_log_in.html`);
    }
})

app.get('/math5squarereverse', function(request, response) {
    if (1 || request.session.loggedin) {
        let x = fs.readFileSync('square5reverse.html').toString();
        x = x.replace(`id="username">`, `id="username">${request.session.username}`);
        
        response.send(x);
    }
    else {
        response.sendFile(`${__dirname}/please_log_in.html`);
    }
})


/**
 * gets the score of an individual user from a url query thing
 */
app.post('/get_score', async(request, response) => {
    try {
        const query = url.parse(request.url, true).query;

        const username = query['username'];
        const type = query['type'];
        const stats = JSON.parse(fs.readFileSync('stats.json'));
        const score = stats[username][type];
        const score_in = stats[username][`${type}_in`];

        if (score) {
            response.json({correct: score, incorrect: score_in});
            response.status(200).send();
        }
        else {
            response.write('failed to send');
        }
    }
    catch (error) {
        response.write('failed to send');
    }
});

/**
 * how the clients submit that one question is done
 * writes to file if successful, tells client if not
 */
app.post('/scores', async (request, response) => {
    let query;
    let username;
    let type;
    let correct;
    try {
        query = url.parse(request.url, true).query;
        username = query['username'];
        type = query['type'];
        correct = query['correct'] == 1;

        const stats = JSON.parse(fs.readFileSync('stats.json'));
        if (correct) {
            stats[username][type]++;
        }
        else {
            stats[username][`${type}_in`]++;
        }

        fs.writeFileSync('stats.json', JSON.stringify(stats));       
    
        console.log(`Username ${username} answered a ${type} question that was correct? ${correct}`);

        if (stats) {
            //response.json({score:10});
            response.status(200).send();
        } 
        else {
            response.writeHead(InternalServerError);
            response.write('failed to send');
        }  
    }
    catch(err) {
        console.error(err);
        response.writeHead(InternalServerError);
        response.write('failed to send');
    }
});

app.listen(80);