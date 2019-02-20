# UploadCSVToPostgres

## OVERVIEW:

It is a simple batch job that retrieves a CSV file from a URL, which imports orders into a
database(Postgres).</br>Ensuring that the customer exists in
the database before importing the order, otherwise skip the import for the order.

## ASSUMPTION:

There is an existing collection/table of customers and orders.

## EXAMPLE:

CSV header with a sample input (1 order per line)</br>
orderId,customerId,item,quantity</br>
sample-123,customer-321,Flowers,2

Table/Collection Schema:</br>
Customers</br>
customerId (String)</br>
firstName (String)</br>
lastName (String)

Orders</br>
orderId (String)</br>
customerId (String)</br>
item (String)</br>
quantity (Number)

## COMMAND:

### To run batch job (Read CSV file from url and importing data into postgres if customer exists in Customers table).

npm install -- to install all the dependencies.</br>
node src/index.js -- this will execute the batch job.</br>

### To run unit tests

npm run test
