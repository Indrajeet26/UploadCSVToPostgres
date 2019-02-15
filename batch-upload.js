
const request= require('request');
const csv= require('csvtojson');
const format=require('pg-format');


const MAX_BATCH_SIZE =1000;

const url = "https://s3-ap-southeast-2.amazonaws.com/testcsvindra/orderData.csv";

const QUERY_PREFIX = "INSERT INTO public.order (orderid, customerid, item, quantity) SELECT i.orderid,i.customerid, i.item, i.quantity FROM(" +
" VALUES %L ) AS i (orderid, customerid, item, quantity)" + 
" WHERE exists (SELECT customerid from public.customer WHERE customer.customerid=i.customerid)";

const populateOrderData = async (pgPool, orderRedcord)=>{
    queries.push(Object.values(orderRedcord));
    if(queries.length===MAX_BATCH_SIZE)
    {
        const queriesBatchTemp= queries.slice(0,MAX_BATCH_SIZE);
        try{
            await executeBatch(queriesBatchTemp);
        }
        catch(err){
            console.error(`Error during calling executeQueryBatch to insert records ${err}`)
        }
    }

}


const _executeBatch = dbService => (queries = []) => {
    if(queries.length===0) return;

    const queryString = format(QUERY_PREFIX,queries);
    return dbService.query(queryString);
}



const batchJob =(dbService)=>{
    let queries;
    const executeBatch = _executeBatch(dbService)
csv().fromStream(request.get(url))
.subscribe((orderRedcord)=>{
   populateOrderData(pgPool, orderRedcord);
})
.on("done", async ()=>{
    await executeBatch(queries);
});
}

module.exports = {batchJob,
_executeBatch};