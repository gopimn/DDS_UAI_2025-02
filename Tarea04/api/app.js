const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
app.get("/status", (request,response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});

function reverseInt(num) {
    let result = num.toString().split("").reverse().join("");
    return parseInt(result);
}

function calculateVerifier(rut) {
    let multiplier = 2; // it starts with 2, then follows with 3,4,5,6,7 and it loops back to 2
    let result = 0;

    for (let digit of reverseInt(rut).toString()) {
        digit = parseInt(digit);
        result += (digit * multiplier);

        if (multiplier == 7) {
            multiplier = 1;
        }
        multiplier++;
    }
    result = result - (Math.trunc(result / 11) * 11);
    result = 11 - result;
    result = result.toString(); // it needs to be a str since it could be a letter

    if (result == "11"){
        result = "0";
    }else if (result == "10") {
        result = "k";
    }
    
    return result;
}

app.get("/verify",(request, response) => {
    const rut = request.query.rut;

    let verifierDigit = calculateVerifier(rut);
    response.send({
        "Verifier": verifierDigit
    })
})
// Start the server
app.listen(PORT, () => {
    console.log(`API listening at http://localhost:${PORT}`);
});
