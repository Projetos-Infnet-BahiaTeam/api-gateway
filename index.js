const httpProxy = require('express-http-proxy');

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

var logger = require('morgan');
require('dotenv').config();
app.use(logger('dev'));

const router = express.Router();

const HOST = process.env.API_HOST;
const PORT = process.env.SERVER_PORT;

function selectProxyHost(req) {
    if (req.path.startsWith('/user')){
        console.log('Api Gateway is calling ms-user...');
        return HOST + ":" +process.env.MS_USER_PORT;
    }    

    if (req.path.startsWith('/patient'))  {
        console.log('Api Gateway is calling ms-patient...');
        return HOST + ":" + process.env.MS_PATIENT_PORT;
    }  

    if (req.path.startsWith('/doctor'))  {
        console.log('Api Gateway is calling ms-doctor...');
        return HOST + ":" + process.env.MS_DOCTOR_PORT;  
    }

    if (req.path.startsWith('/appointment'))  {
        console.log('Api Gateway is calling ms-appointment...');
        return HOST + ":" + process.env.MS_APPOINTMENT_PORT;  
    }

    else if (req.path.startsWith('/test')){
        //tratamento erro
    }
}
 
app.use((req, res, next) => {
    httpProxy(selectProxyHost(req))(req, res, next);
});

app.listen(PORT, () => {
    console.log('API Gateway running on port: '+ PORT);
});