const rutForm = document.getElementById("rutForm");

function reverseInt(num) {
    let result = num.toString().split("").reverse().join("");
    return parseInt(result);
}


function rutToNum(rutStr) { // return an array with the rut and its verifier digit cleaning all dots and hyphen 

    let cleanRut = "";
    
    for (let char of rutStr) {
        if (char != "." && char != "-") {
            cleanRut += char;
        }
    }
    
    let rut = parseInt(cleanRut.slice(0,-1));
    let verifier = cleanRut.slice(-1);
    
    return [rut,verifier];
}

function validateRut(rut, verifier) {
    verifier = verifier.toLowerCase();
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
        result = 0;
    }else if (result == "10") {
        result = "k";
    }
    
    if (result == verifier) {
        return true
    } else return false

}

function validateRutForm(){

}

