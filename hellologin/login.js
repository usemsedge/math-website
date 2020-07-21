"use strict";

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var url = require('url');
var nodemailer = require('nodemailer');

var fs = require("fs");
const { response } = require('express');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const email_regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/


function xread(file) {
    return fs.readFileSync(file).toString();
}

var app = express();

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
    response.sendFile(path.join(__dirname + '/login.html'));
});


app.get('/register', function(request, response) {
    response.sendFile(path.join(__dirname + '/register.html'));
});


//assuming read looks like
// user1:pw1\nuser2:pw2\n

app.post('/reg', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var password2 = request.body.password2;
    var email = request.body.email;

    console.log(username, password, password2, email);
    
    var contents = JSON.parse(fs.readFileSync("list.json"));


    if (username && password && password2 && email) {
        if (!email.match(email_regex)) {
            response.send("Invalid Email");
            return;
        }
        if (password !== password2) {
            response.send("Passwords do not match");
            return;
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
        var k = JSON.parse(fs.readFileSync('stats.json'));
        k.push([username, 0, 0, 0, 0, 0, 0, 0, 0]);
        fs.writeFileSync('stats.json', JSON.stringify(k));
        response.redirect('/');
        return;


    }
    response.send("Please enter Usernsme and/or Password!");
});

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        var contents = JSON.parse(xread("list.json"));
        try {
            if (contents[username][0] == password) {
                request.session.loggedin = true;
                request.session.username = username;
                if (request.session.username == 'admin') {
                    //admins can see the email thig
                    response.redirect('/email');
                    return;
                }
                response.redirect('/home');
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

    } else {
        response.send('Please enter Username and/or Password!');
        response.end();
    }
});


app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.redirect('/math');
    } else {
        response.sendFile(`${__dirname}/please_log_in.html`);
    }
    response.end();

});

function send_mail_to_all(contents, email, password, subject, text) {
    for (var key in contents) {
        var value = contents[key];

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: email,
            pass: password
            }
        });
        
        var mailOptions = {
            from: email,
            to: value[1],
            subject: subject,
            text: text
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });

    }
}

app.get('/email', function(request, response) {
    //only admin can use tis
    if (request.session.username == 'admin') {
        console.log(request.url);

        if (request.url !== '/email') {
            let query = url.parse(request.url, true).query;

            var subject = query['subject'];
            var text = query['text'];

            console.log(query, subject, text);


            var my_email = "noreply3298@gmail.com"; // the email youre sending stuff from
            var my_password = "averysimplepassword1"; // the password to the email above
            //suggested to make this email a disposable alt, this way the password doesn't matter

            var contents = JSON.parse(fs.readFileSync('list.json'));

            send_mail_to_all(contents, my_email, my_password, subject, text);
        }
        response.sendFile(`${__dirname}/admin.html`);
    }
    else {
        response.send('You are not authorized to use this');

    }
});


app.get('/math', function(request, response) {
    var stats = JSON.parse(fs.readFileSync('stats.json'));
    var fraction_data = [];
    var pf_data = [];
    var lcm_data = [];
    var square_data = [];

    for (var i = 0; i < stats.length; i++) {
        fraction_data.push([stats[i][0], stats[i][1], stats[i][2]]);
        pf_data.push([stats[i][0], stats[i][3], stats[i][4]]);
        lcm_data.push([stats[i][0], stats[i][5], stats[i][6]]);
        square_data.push([[stats[i][0]], stats[i][7], stats[i][8]]);
    }

    fraction_data.sort((a, b) => a[1] - b[1]);
    pf_data.sort((a, b) => a[1] - b[1]);
    lcm_data.sort((a, b) => a[1] - b[1]);
    square_data.sort((a, b) => a[1] - b[1]);


    
    var fraction_text = "";
    var pf_text = "";
    var lcm_text = "";
    var square_text = "";

    var fraction_text2 = "";
    var pf_text2 = "";
    var lcm_text2 = "";
    var square_text2 = "";
    
    console.log(square_data);

    for (var i = 0; i < stats.length; i++) {
        var f = fraction_data[i];
        var p = pf_data[i];
        var l = lcm_data[i];
        var s = square_data[i];
        console.log(s)

        fraction_text = `<tbody><tr><td>${f[0]}</td></tr></tbody>` + fraction_text;
        pf_text = `<tbody><tr><td>${p[0]}</tr></td></tbody>` + pf_text;
        lcm_text = `<tbody><tr><td>${l[0]}</tr></td></tbody>` + lcm_text;
        square_text = `<tbody><tr><td>${s[0]}</tr></td></tbody>` + square_text;

        fraction_text2 = `<tbody><tr><td> ${f[1]}</td></tr></tbody>` + fraction_text2;
        pf_text2 = `<tbody><tr><td> ${p[1]}</tr></td></tbody>` + pf_text2;
        lcm_text2 = `<tbody><tr><td> ${l[1]}</tr></td></tbody>` + lcm_text2;
        square_text2 = `<tbody><tr><td>${s[1]}</tr></td></tbody>` + square_text2;
        
        
    }
    var htmlstuff = fs.readFileSync('index.html').toString();
    htmlstuff = htmlstuff.replace('<tr>fractions</tr>', fraction_text);
    htmlstuff = htmlstuff.replace('<tr>lcm</tr>', lcm_text);
    htmlstuff = htmlstuff.replace('<tr>pf</tr>', pf_text);
    htmlstuff = htmlstuff.replace('<tr>square</tr>', square_text);

    htmlstuff = htmlstuff.replace('<tr>fractions2</tr>', fraction_text2);
    htmlstuff = htmlstuff.replace('<tr>lcm2</tr>', lcm_text2);
    htmlstuff = htmlstuff.replace('<tr>pf2</tr>', pf_text2);
    htmlstuff = htmlstuff.replace('<tr>square2</tr>', square_text2);

    response.send(htmlstuff);


});


app.get('/mathlcm', function(request, response) {
    if (request.session.loggedin) {
        var x = fs.readFileSync('least_common_multiple.html').toString();
        x = x.replace(`id="username">`, `id="username">${request.session.username}`);
        
        response.send(x);
    }
    else {
        response.sendFile(`${__dirname}/please_log_in.html`)
    }
});


app.get('/mathfactor', function(request, response) {
    if (request.session.loggedin) {
        var x = fs.readFileSync('prime_factorization.html').toString();
        x = x.replace(`id="username">`, `id="username">${request.session.username}`);
        
        response.send(x);
    }
    else {
        response.sendFile(`${__dirname}/please_log_in.html`)
    }
});

app.get('/mathfractions', function(request, response) {
    if (request.session.loggedin) {
        var x = fs.readFileSync('add_fractions.html').toString();
        x = x.replace(`id="username">`, `id="username">${request.session.username}`);
        
        response.send(x);
    }
    else {
        response.sendFile(`${__dirname}/please_log_in.html`);
    }
});

app.get('/mathsquare', function(request, response) {
    if (request.session.loggedin) {
        var x = fs.readFileSync('squares.html').toString();
        x = x.replace(`id="username">`, `id="username">${request.session.username}`);
        
        response.send(x);
    }
    else {
        response.sendFile(`${__dirname}/please_log_in.html`);
    }
})






// send request via index.html
app.post('/scores', async (request, response) => {
    try {

        let query = url.parse(request.url, true).query;

        const username = query['username'];
        const type = query['type'];
        const correct = query['correct'] == 1;
        console.log("Recieved Data: ", username, type, correct);

        var obj = JSON.parse(fs.readFileSync('stats.json'));
        for (var i = 0; i < obj.length; i++) {
            if (obj[i][0] === username) {
                if (type === 'fraction') {
                    if (correct) {
                        obj[i][1]++;
                    }
                    else {
                        obj[i][2]++;
                    }
                    console.log('fraction');
                }
                else if (type === 'pf') {
                    if (correct) {
                        obj[i][3]++;
                    }
                    else {
                        obj[i][4]++;
                    }
                    console.log('pf')
                }
                else if (type === 'lcm') {
                    if (correct) {
                        obj[i][5]++;
                    }
                    else {
                        obj[i][6]++;
                    }
                    console.log('lcm');
                }
                else if (type === 'square') {
                    if (correct) {
                        obj[i][7]++;
                    }
                    else {
                        obj[i][8]++;

                    }
                    console.log('square');
                }
				fs.writeFileSync('stats.json', JSON.stringify(obj));
                break;
            }
        }


        if (obj) {
            response.status(200).send('sent successfully');
        } 
        else {
            response.writeHead(InternalServerError);
            response.write('failed to send');
        }  
    }
    catch(err) {
        console.log(username, type, correct);
        response.writeHead(InternalServerError);
        response.write('failed to send');
    }
});

app.listen(80);