const rutForm = document.getElementById("rutForm");

function validateRutForm(){

}


function validateRut(rut) {

}

function rutToNum(rutStr) { // return an array with the rut and its verifier digit cleaning all dots and hyphen with int type

    let cleanRut = "";

    for (let char of rutStr) {
        if (char != "." && char != "-") {
            cleanRut += char;
       }
    }

    let rut = parseInt(cleanRut.slice(0,-1));
    let verifier = parseInt(cleanRut.slice(-1));

    return [rut,verifier];
}