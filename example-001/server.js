const express = require('express');
const path = require("path");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const nodemailer = require('nodemailer');

// Middlewares
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + path.join('/public/contactForm.html'));
});

app.post('/', (req, res) => {
    console.log(req.body);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vitofirulito@gmail.com',
            pass: 'clvylvohl'
        }
    });
    const mailOptions = {
        from: req.body.email,
        to: 'jorgealbertogomezgomez77@gmail.com',
        subject: `Message from ${ req.body.email }: ${req.body.subject}`,
        text: req.body.message
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('success');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}. Visit http://localhost:${PORT}`);
})
