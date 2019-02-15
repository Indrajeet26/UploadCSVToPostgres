
const request= require('request');
const csv= require('csvtojson');
const format=require('pg-format');

const DEFAULT_MAX_BATCH_SIZE =1000;



const QUERY_PREFIX = "INSERT INTO public.order (orderid, customerid, item, quantity) SELECT i.orderid,i.customerid, i.item, i.quantity FROM(" +
" VALUES %L ) AS i (orderid, customerid, item, quantity)" + 
" WHERE exists (SELECT customerid from public.customer WHERE customer.customerid=i.customerid)";


const _insertRecord = (queries, executeBatch,batchSize ) => async orderRedcord=>{
    queries.push(Object.values(orderRedcord));
    if(queries.length===batchSize)
    {
        const queriesBatchTemp= queries.slice(0,batchSize);
            
            await executeBatch(queriesBatchTemp); 
            queries=queries.slice(batchSize)
             
    }
  return queries;
};


const _executeBatch = dbService => (queries = []) => {
    if(queries.length===0) return;

    const queryString = format(QUERY_PREFIX,queries);
    return dbService.query(queryString);
}


const batchJob =(converter,dbService)=>{
    let queries;
  const batchSize = inputBatchSize || DEFAULT_MAX_BATCH_SIZE;
    const executeBatch = _executeBatch(dbService);
    const insertRecord = _insertRecord([],executeBatch,batchSize);
    converter
.subscribe(async orderRedcord=>{
queries = await insertRecord(orderRedcord);
})
.on("done", async ()=>{
    await executeBatch(queries);
});
}

module.exports = {batchJob,
_executeBatch,
_insertRecord};