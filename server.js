const express = require("express");
const cors = require("cors"); 
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

let ultimaResposta = '';

app.post("/receber-resposta", (req, res) => {
    ultimaResposta = req.body.resposta;
    console.log("resposta recebida:", ultimaResposta);
    res.send("resposta recebida com sucesso!");
});

app.get("/obter-resposta", (req, res) => {
    res.json({ resposta: ultimaResposta });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
