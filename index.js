const {batchJob} =require('./batch-upload');
const pg= require('pg');

const config={
    user:"postgres",
    databse:"postgres",
    host:"localhost",
    password:"putyoursbpassword",
    port:5432
}

const batchSize = 1000;

const url = "https://s3-ap-southeast-2.amazonaws.com/testcsvindra/orderData.csv";
const 

const converter  =csv().fromStream(request.get(url));


const dbService = new pg.Pool(config);


batchJob(converter,dbService);