const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const usuarios = [
    "alice_wonder",
    "bob_builder",
    "charlie_chef",
    "diana_diver",
    "ethan_engineer"
];

app.use(express.json());

app.use(cors());

// USA ESTE MIDLEWARE
app.use((req, res, next) => {
   console.log('Time:', Date.now());
   next();
})


app.get("/usuarios", async(req,res) => {
   await sleep(2000); // Pause for 2 seconds
   console.log('RETORNANDO DESPUES DE DORMIR');
   res.send(usuarios);
   //res.send(15);
});

app.post("/usuarios", (req,res) => {
   //const usuario = req;
   const { usuario } = req.body;
   usuarios.push(usuario);
   console.log(usuario);
   res.send('user added in the name of the peace');
})

app.listen(port, () => {
   console.log("runnin on 3000");
});

/*


- listen ty definir puerto
- definir usuario
- next en el middleware
- en el post obtener el usuario del json del body



curl -H 'Content-Type: application/json'  -d '{"usuario":"asdasdasd"}'       -X POST       http://127.0.0.1:3000/usuarios

curl http://127.0.0.1:3000/usuarios 


## maybe

- retornar los codigos
   - 2xx exito
   - 4xx fail
   - 5xx culpa ser servidor
- try catch



*/