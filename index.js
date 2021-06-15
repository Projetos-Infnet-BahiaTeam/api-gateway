const httpProxy = require('express-http-proxy');
const auth = require('./security/auth');

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

var logger = require('morgan');
require('dotenv').config();
app.use(logger('dev'));

const HOST = process.env.API_HOST;
const PORT = process.env.SERVER_PORT;

function selectProxyHost(req, res) {
    if (req.path.startsWith('/api/patients'))  {
        console.log('Api Gateway is calling ms-patient...');
        return HOST + ":" + process.env.MS_PATIENT_PORT;
    }  

    if (req.path.startsWith('/api/doctors'))  {
        console.log('Api Gateway is calling ms-doctor...');
        return HOST + ":" + process.env.MS_DOCTOR_PORT;  
    }

    if (req.path.startsWith('/api/appointments'))  {
        console.log('Api Gateway is calling ms-appointment...');
        return HOST + ":" + process.env.MS_APPOINTMENT_PORT;  
    }
    else if (req.path.startsWith('/')){
        res.status(404).send("Path does not exist!");
    }
}
//helth check
app.get('/online', function(req, res){
    res.status(200).send({message:'API-GATEWAY IS UP'});
});

// Authentication
app.use('/api', auth);
 
app.use((req, res, next)  => {
    httpProxy(selectProxyHost(req, res))(req, res, next);
});

app.listen(PORT, () => {
    console.log('API Gateway running on port: '+ PORT);
});