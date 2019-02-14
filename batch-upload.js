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


const populateOrderData = (pgPool, orderRedcord)=>{
    pgPoool.query("INSERT INTO public.order (orderid, customerid, item, quantity)" +
                " VALUES ($1, $2, $3, $4) RETURNING *", 
            [       orderRedcord.orderid,
                    orderRedcord.customerid,
                    orderRedcord.item,
                    orderRedcord.quantity

                ])

}
csv().fromStream(request.get(url))
.subscribe((orderRedcord)=>{
   populateOrderData(pgPool, orderRedcord);
})
.on("done",()=>{
//some logic after done event
})