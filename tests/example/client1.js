// node client1.js
const body = JSON.stringify({
    con_prod_pairs: [{
        consumer_id: "+42",
        producer_id: 1,
    },{
        consumer_id: 43,
        producer_id: "2",
    },{
        consumer_id: "4.4e1",
        producer_id: "3",
    }],
    client_id: "3104",
    usesAuth: "true"
})

const response = await fetch("http://localhost:3000/", {
    method: "POST",
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    },
    body: body
})

console.log(JSON.stringify(await response.json(), undefined, "  "))

/*
We would get:
{
  "body": {
    "con_prod_pairs": [
      {
        "consumer_id": 42,
        "producer_id": 1
      },
      {
        "consumer_id": 43,
        "producer_id": 2
      },
      {
        "consumer_id": 44,
        "producer_id": 3
      }
    ],
    "client_id": 3104,
    "usesAuth": true
  },
  "coercer": {
    "searchOptions": {
      "locations": "all",
      "keys": [],
      "recDepth": -1,
      "searchArray": true
    },
    "searchLocations": [
      {
        "con_prod_pairs": [
          {
            "consumer_id": 42,
            "producer_id": 1
          },
          {
            "consumer_id": 43,
            "producer_id": 2
          },
          {
            "consumer_id": 44,
            "producer_id": 3
          }
        ],
        "client_id": 3104,
        "usesAuth": true
      },
      {},
      {}
    ],
    "results": [
      {
        "success": true,
        "key": "consumer_id",
        "before": "+42",
        "after": 42
      },
      {
        "success": true,
        "key": "producer_id",
        "before": 1,
        "after": 1
      },
      {
        "success": true,
        "key": "consumer_id",
        "before": 43,
        "after": 43
      },
      {
        "success": true,
        "key": "producer_id",
        "before": "2",
        "after": 2
      },
      {
        "success": true,
        "key": "consumer_id",
        "before": "4.4e1",
        "after": 44
      },
      {
        "success": true,
        "key": "producer_id",
        "before": "3",
        "after": 3
      },
      {
        "success": true,
        "key": "consumer_id",
        "before": 42,
        "after": 42
      },
      {
        "success": true,
        "key": "producer_id",
        "before": 1,
        "after": 1
      },
      {
        "success": true,
        "key": "consumer_id",
        "before": 43,
        "after": 43
      },
      {
        "success": true,
        "key": "producer_id",
        "before": 2,
        "after": 2
      },
      {
        "success": true,
        "key": "consumer_id",
        "before": 44,
        "after": 44
      },
      {
        "success": true,
        "key": "producer_id",
        "before": 3,
        "after": 3
      },
      {
        "success": true,
        "key": "client_id",
        "before": "3104",
        "after": 3104
      },
      {
        "success": true,
        "key": "usesAuth",
        "before": "true",
        "after": true
      }
    ]
  }
}
*/