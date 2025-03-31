const express = require("express");
const cors = require("cors"); 
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const corsOptions = {
    origin: "https://gartic.com.br/",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

let ultimaResposta = "";
let contasPrincipais = {};

app.post("/post", (req, res) => {
    ultimaResposta = req.body.resposta;
    console.log("palavra recebida:", ultimaResposta);
    res.send("Palavra recebida com sucesso!");
});

app.get("/get", (req, res) => {
    res.json({ resposta: ultimaResposta });
});

app.post("/setPrincipal", (req, res) => {
    let userId = req.cookies.userId;

    if (!userId) {
        userId = Math.random().toString(36).substr(2, 9);
        res.cookie("userId", userId, {
            httpOnly: true,
            sameSite: "None",
            secure: true, 
        });
    }

    for (const id in contasPrincipais) {
        contasPrincipais[id] = false;
    }

    contasPrincipais[userId] = true;

    console.log(Conta principal definida: ${userId});

    res.json({ userId, principal: true });
});

app.get("/getPrincipal", (req, res) => {
    const userId = req.cookies.userId;
    const principal = !!contasPrincipais[userId];

    res.json({ principal });
});

app.listen(port, () => console.log(Servidor rodando na porta ${port}));
