const rutForm = document.getElementById("rutForm");

// dont refresh page
rutForm.addEventListener("submit", function(event) {
    event.preventDefault();
});


function rutToNum(rutStr, verifierStr) { 
// return an array with the rut and its verifier digit cleaning all dots and hyphen 
// we still return the verifier as str because validateRut compares strings for verifier digit

    let cleanRut = "";
    
    for (let char of rutStr) {
        if (char != "." && char != "-") {
            cleanRut += char;
        }
    }
    
    let rut = parseInt(cleanRut);
    let verifier = verifierStr;
    
    return [rut,verifier];
}


function validateRutForm(){
    const rutRaw = document.getElementById("rut").value;
    const verifierDigit = document.getElementById("verifier").value.toLowerCase();
    const alert = document.getElementById("alert");

    let [rut, verifier] = rutToNum(rutRaw, verifierDigit);

    (async () => {
        const response = await fetch("http://localhost:3000/verify?rut="+rut);
        const data = await response.json();
        let calculatedVerifier = data.Verifier;

        let isValid = calculatedVerifier == verifier;
        if (isValid){
            alert.innerText = ("El digito verificador calculado es: "+ calculatedVerifier + "\n¡Rut Valido! :)");
            return true;
        }
        else{
            alert.innerText = ("El digito verificador calculado es: "+ calculatedVerifier + "\n¡Rut Invalido! :(");
            return false;
        } 
    })();
        

}

