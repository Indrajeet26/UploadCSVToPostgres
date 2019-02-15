const chai = require("chai");

const expect = chai.expect;

describe("_executeBatch test cases", () => {
  const { _executeBatch } = require("./batch-upload");

  it("Should not execute queries if queries batch is empty", () => {
    let counter = 1;
    const dbService = {
      query: () => {
        counter += 1;
      }
    };

    const executeBatch = _executeBatch(dbService);
    executeBatch([]);
    expect(counter).to.be.equal(1);
  });

  it("Should execute queries if queries batch is not empty", () => {
    let counter = 1;
    const dbService = {
      query: qs => {
        const expectedQueryString =
          "INSERT INTO public.order (orderid, customerid, item, quantity) SELECT i.orderid,i.customerid, i.item, i.quantity FROM( VALUES ('0'), ('1') ) AS i (orderid, customerid, item, quantity) WHERE exists (SELECT customerid from public.customer WHERE customer.customerid=i.customerid)";
        expect(qs).to.be.equal(expectedQueryString);
        counter += 1;
      }
    };

    const executeBatch = _executeBatch(dbService);
    executeBatch([[0], [1]]);
    expect(counter).to.be.equal(2);
  });
});

describe("_insertRecord test cases", () => {
  const { _insertRecord } = require("./batch-upload");

  it("Should not execute unless max limit is reached", async () => {
    let counter = 1;
    const executeBatch = () => {
      counter += 1;
    };
    const batchSize = 4;

    const insertRecord = _insertRecord([], executeBatch, batchSize);

    const promises = [];
    for (let i = 0; i < batchSize - 1; i = i + 1) {
      promises.push(insertRecord(i));
    }

    const queryResponses = await Promise.all(promises);

    const queries = queryResponses[queryResponses.length - 1];

    expect(counter).to.be.equal(1);
    expect(queries.length).to.be.eq(batchSize - 1);
  });

  it("Should execute batch if max limit is reached and clear query batch", async () => {
    let queries;
    let counter = 1;
    const batchSize = 3;
    const executeBatch = arr => {
      const expectedArr = [[0], [1], [2]];
      counter += 1;
      expect(JSON.stringify(expectedArr)).to.be.equal(JSON.stringify(arr));
    };

    const insertRecord = _insertRecord([], executeBatch, batchSize);

    for (let i = 0; i < batchSize; i++) {
      queries = await insertRecord({ i });
    }

    expect(counter).to.be.equal(2);
    expect(queries.length).to.be.eq(0);
  });

  it("Should throw error if execute batch fails due to db issue", async () => {
    const errMsg = "Failed to insertRecord";
    const batchSize = 3;
    const executeBatch = () => {
      throw new Error(errMsg);
    };

    const insertRecord = _insertRecord([], executeBatch, batchSize);

    try {
      await insertRecord({});
    } catch (err) {
      expect(err.message).to.be.equal(errMsg);
    }
  });
});
