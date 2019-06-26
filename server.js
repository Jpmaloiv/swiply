
require("dotenv").config();
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')

// Express setup
const app = express();
const PORT = process.env.PORT || 3001;

// Import models
const db = require(path.join(__dirname + '/models'));

// Import routes
const api = require('./routes')


// file upload middleware
// app.use(fileUpload())
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '500mb' }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


app.use(express.static(path.join(__dirname, 'client/build')));

app.use(express.static(path.join(__dirname + '/public')));

//   AWS TEST 
app.set('client', './client');
app.use(express.static('./client/public'));
app.engine('html', require('ejs').renderFile);

// Routes
app.use('/api/', api)

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

db.sequelize.sync({ force: false, logging: console.log }).then(function () {
    app.listen(PORT, function () {
        console.log('App listening on PORT ' + PORT);
    })
});