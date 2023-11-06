// node client1.js
const body = JSON.stringify({
    con_prod_pairs: [{
        consumer_id: "4.2",
        producer_id: "1",
    },{
        consumer_id: "-43",
        producer_id: "2",
    },{
        consumer_id: "14",
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

/* We would get
{
  "error": "Invalid request format. See errors array for a list of errors (This message is generated by express-coercer).",
  "errors": [
    "Expecting the value of consumer_id to have one of the following formats: [\"String of integer\",\"Integer number\"]",
    "Expecting the value of consumer_id to have one of the following formats: [\"String of positive integer\",\"Positive integer number\"]"
  ]
}
*/