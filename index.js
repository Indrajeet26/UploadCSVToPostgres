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

const dbService = new pg.Pool(config);
batchJob(dbService,batchSize);