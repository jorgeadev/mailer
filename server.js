const express = require('express');
const cors = require("cors");
const path = require("path");
require('dotenv').config();
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");

const PORT = process.env.PORT || 5000;
// instantiate an express app
const app = express();
// cors
app.use(cors({ origin: "*" }));
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

// verify connection configuration
transporter.verify((err, success) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server is ready to take our messages");
    }
});

app.post('/send', (req, res) => {
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, (err, fields) => {
        console.log(fields);
        Object.keys(fields).forEach((property) => {
            data[property] = fields[property].toString();
        });
        console.log(data);
        const mail = {
            sender: `${data.name} <${data.email}>`,
            // to: process.env.EMAIL, // receiver email,
            to: data.email, // receiver email,
            subject: data.subject,
            text: `${data.name} <${data.email}> \n${data.message}`,
        };
        transporter.sendMail(mail, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send('Something went wrong.');
            } else {
                res.status(200).send("Email successfully sent to recipient!");
            }
        });
    });
});

// index page (static HTML)
app.get('/', (req, res) => {
    res.sendFile(__dirname + path.join('/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}. Visit http://localhost:${PORT}`);
});
