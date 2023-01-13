const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000
require('dotenv').config();


// account for incoming json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// deal with cors headers
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// mongoose cloud db setup
mongoose.set("strictQuery", false)
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('DB connection OPEN!')
})
.catch(err => {
    console.log('major error alert: ', err)
})

// put routers here we use here
const reposRouter = require(path.resolve('server/routers/reposAPI'))

// serve static assets here (dont exist yet)


// handle reqs here
app.use('/reposAPI', reposRouter)


// catch all reqs to bad routes
app.use((req, res) => {
    res.status(404).send('not routing correctly! nothing found');
})

// Global error handler
app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 400,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
})