const chai = require("chai");
const expect =chai.expect;

describe("_executeBatch test cases", () =>{
    const {_executeBatch } = require("./batch-upload");

    it("Should not execute queries if queries batch is empty", ()=>{
        let counter =1;
        const dbService ={
            query:()=>{
                counter=counter+1;
            }
        };
 
        const executeBatch = _executeBatch(dbService);
        executeBatch([]);
        expect(counter).to.be.equal(1);

    });

    it("Should execute queries if queries batch is not empty", ()=>{
        let counter =1;
        const dbService ={
            query: qs =>{
                expectedQueryString="INSERT INTO public.order (orderid, customerid, item, quantity) SELECT i.orderid,i.customerid, i.item, i.quantity FROM( VALUES ('0'), ('1') ) AS i (orderid, customerid, item, quantity) WHERE exists (SELECT customerid from public.customer WHERE customer.customerid=i.customerid)"
                expect(qs).to.be.equal(expectedQueryString);
                counter=counter+1;
            }
        };
 
        const executeBatch = _executeBatch(dbService);
        executeBatch([[0],[1]]);
        expect(counter).to.be.equal(2);

    })
}
);
