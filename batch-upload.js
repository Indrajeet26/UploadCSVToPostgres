const pg= require('pg');
const request= require('request');
const csv= require('csvtojson');

const config={
    user:"postgres",
    databse:"postgres",
    host:"localhost",
    password:"putyoursbpassword",
    port:5432
}

const pgPool = new pg.Pool(config);

const url = "https://s3-ap-southeast-2.amazonaws.com/testcsvindra/orderData.csv";

csv().fromStream(request.get(url))
.subscribe((orderRedcord)=>{
 //some logic after steaming
})
.on("done",()=>{
//some logic after done event
})