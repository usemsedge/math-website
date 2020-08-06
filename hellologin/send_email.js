"use strict";

var nodemailer = require("nodemailer");
var fs = require("fs");

const my_email = "noreply3298@gmail.com"; // the email youre sending stuff from
const my_password = "averysimplepassword1"; // the password to the email above
//suggested to make this email a disposable alt, this way the password doesn't matter

contents = JSON.parse(fs.readFileSync('list.json'));

/**
 * 
 * @param {Object} contents contents of list.json
 * @param {string} email email to send the stuff from
 * @param {string} password password to the above email
 * @param {string} subject the subject of the email to send everyone
 * @param {string} text the text of the email to send everyone
 */
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


subject = 'Math Website';
text = 'Thank you for recieving this email! Please check out our website.';


//send_mail_to_all(contents, my_email, my_password, subject, text);