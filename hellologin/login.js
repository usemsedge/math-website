"use strict";

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var fs = require("fs");
const { response } = require('express');

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

	if (username && password) {
		//check if username is already taken
		var contents = xread("list.txt");
		contents = contents.split('\n');
		for (var i = 0; i < contents.length; i++) {
			var u = contents[i].split(':');	
			if (u[0] == username) {
				response.send("Username is Taken Already");	
				return;
			}
		}


		//create the new account with password
		fs.appendFileSync('list.txt', `\n${username}:${password}`);

		//set the stats
		fs.appendFileSync('stats_fractions.txt', `\n${username}:0:0`);
		fs.appendFileSync('stats_lcm.txt', `\n${username}:0:0`);
		fs.appendFileSync('stats_pf.txt', `\n${username}:0:0`);
		response.redirect('/');
		return;


	}
	response.send("Please enter Usernsme and/or Password!");
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		var contents = xread("list.txt");
		console.log(contents);
        contents = contents.split('\n');
        for (var i = 0; i < contents.length; i++) {
            var u = contents[i].split(':');	
            if (u[0] == username && u[1] == password) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
                return;
            }
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
		response.send('Please login to view this page!');
	}
	response.end();

});


app.get('/math', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(`${__dirname}/index.html`);
	}
	else {
		response.sendFile(`${__dirname}/please_log_in.html`);
	}
});


app.get('/mathlcm', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(`${__dirname}/least_common_multiple.html`);
	}
	else {
		response.sendFile(`${__dirname}/please_log_in.html`)
	}
});


app.get('/mathfactor', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(`${__dirname}/prime_factorization.html`);
	}
	else {
		response.sendFile(`${__dirname}/please_log_in.html`)
	}
});

app.get('/mathfractions', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(`${__dirname}/add_fractions.html`);
	
	}
	else {
		response.sendFile(`${__dirname}/please_log_in.html`);
	}
});

app.listen(80);