# UploadCSVToPostgres

# OVERVIEW:

It is a simple batch job that retrieves a CSV file from a URL, which imports orders into a
database(Postgres). Ensuring that the customer exists in
the database before importing the order, otherwise skip the import for the order.

# ASSUMPTION:

There is an existing collection/table of customers and orders.

# EXAMPLE:

CSV header with a sample input (1 order per line)
orderId,customerId,item,quantity
sample-123,customer-321,Flowers,2

Table/Collection Schema:
Customers
customerId (String)
firstName (String)
lastName (String)

Orders
orderId (String)
customerId (String)
item (String)
quantity (Number)

# COMMAND:

To run batch job (Read CSV file from url and importing data into postgres if customer exists in Customers table)

npm install -- to install all the dependencies
node src/index.js -- this will execute the batch job

To run unit tests

npm run test
