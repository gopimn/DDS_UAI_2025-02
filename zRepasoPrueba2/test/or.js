const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res) => {
 console.log("aca va el midleware brother")
});

app.get("/usuarios", (req,res) => {
   res.send(usuarios);
});

app.post("/usuarios", (req,res) => {
   const usuario = req;
   usuarios.push(usuario);
   res.send('user added in the name of the peace');
})

console.log("runnin on 3000");