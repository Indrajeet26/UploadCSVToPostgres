const pg= require('pg');
const request= require('request');
const csv= require('csvtojson');
const format=require('pg-format');

const config={
    user:"postgres",
    databse:"postgres",
    host:"localhost",
    password:"putyoursbpassword",
    port:5432
}

const pgPool = new pg.Pool(config);

const url = "https://s3-ap-southeast-2.amazonaws.com/testcsvindra/orderData.csv";

const QUERY_PREFIX = "INSERT INTO public.order (orderid, customerid, item, quantity) SELECT i.orderid,i.customerid, i.item, i.quantity FROM(" +
" VALUES %L ) AS i (orderid, customerid, item, quantity)" + 
"WHERE exists (SELECT customerid from public.customer WHERE customer.customerid=i.customerid)";

const populateOrderData = (pgPool, orderRedcord)=>{
    const val= Object.values(orderRedcord);
    const queryString = format(QUERY_PREFIX,val);
    pgPoool.query(queryString).then(
        //Do something for batch processing
    )
}
csv().fromStream(request.get(url))
.subscribe((orderRedcord)=>{
   populateOrderData(pgPool, orderRedcord);
})
.on("done",()=>{
//some logic after done event
})