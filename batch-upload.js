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

let queriesBatch = [];

const MAX_BATCH_SIZE =1000;

const url = "https://s3-ap-southeast-2.amazonaws.com/testcsvindra/orderData.csv";

const QUERY_PREFIX = "INSERT INTO public.order (orderid, customerid, item, quantity) SELECT i.orderid,i.customerid, i.item, i.quantity FROM(" +
" VALUES %L ) AS i (orderid, customerid, item, quantity)" + 
"WHERE exists (SELECT customerid from public.customer WHERE customer.customerid=i.customerid)";

const populateOrderData = (pgPool, orderRedcord)=>{
    queriesBatch.push(Object.values(orderRedcord));
    if(queriesBatch.length===MAX_BATCH_SIZE)
    {
        const queriesBatchTemp= queriesBatch.slice(0,MAX_BATCH_SIZE);
        try{
            executeQueryBatch(queriesBatchTemp)
        }
        catch(err){
            console.error(`Error during calling executeQueryBatch to insert records ${err}`)
        }
    }

}

const executeQueryBatch = queriesBatchTemp =>{
    if(queriesBatchTemp.length===0) return;

    const queryString = format(QUERY_PREFIX,queriesBatchTemp);
    pgPoool.query(queryString).then(
       queriesBatch = queriesBatch.slice(MAX_BATCH_SIZE)
    ).catch(err=>{
        console.error(`There is error while executing the query ${err}`)
    })
}
csv().fromStream(request.get(url))
.subscribe((orderRedcord)=>{
   populateOrderData(pgPool, orderRedcord);
})
.on("done",()=>{
//some logic after done event
})