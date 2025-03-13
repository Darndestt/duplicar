const desenharBtn = document.querySelector("#desenhar");
const inputResposta = document.querySelector("#respostas input");

let palavraEnviada = "";

function enviarPalavra(palavra) {
    if (palavra && palavra !== palavraEnviada) {
        palavraEnviada = palavra;
        fetch("http://localhost:3000/receber-resposta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resposta: palavra })
        })
        .then(response => response.text())
        .then(data => console.log("Resposta do servidor:", data))
        .catch(error => console.error("Erro ao enviar:", error));
    }
}

function palavraAtual() {
    const todasAsVezes = document.querySelectorAll(".vez");
    
    for (let i = todasAsVezes.length - 1; i >= 0; i--) {
        const texto = todasAsVezes[i].textContent.trim();
        
        if (texto.startsWith("Sua vez, a palavra é:")) {
            return todasAsVezes[i].querySelector("strong")?.textContent.trim() || "";
        }
    }
    
    return "";
}

if (desenharBtn) {
    desenharBtn.addEventListener("click", () => {
        const palavra = palavraAtual();
        if (palavra && palavra !== palavraEnviada) {
            console.log("Palavra da vez:", palavra);
            enviarPalavra(palavra);
        }
    });
}

if (inputResposta) {
    inputResposta.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const resposta = inputResposta.value.trim();
            if (resposta && resposta !== palavraEnviada) {
                enviarPalavra(resposta);
            }
        }
    });
}

let rodadaAtual = "";

function verificarEClickarBotao() {
    const alerta = document.querySelector("#alerta");
    const texto1 = alerta?.querySelector(".texto1");

    if (texto1 && texto1.textContent.trim() === "Sua vez") {
        const palavra = palavraAtual();

        if (palavra && palavra !== rodadaAtual) {
            rodadaAtual = palavra;
            desenharBtn.click();
        }
    } else {
        rodadaAtual = "";
    }
}

function enviarResposta(resposta) {
    console.log("Nova resposta recebida do servidor:", resposta);
    
    if (inputResposta && resposta && resposta !== palavraEnviada) {
        palavraEnviada = resposta;
        inputResposta.value = resposta;
        inputResposta.dispatchEvent(new Event('input', { bubbles: true }));

        const botaoEnviar = document.querySelector("#respostas form");
        botaoEnviar?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
}

let ultimaResposta = '';

function buscarResposta() {
    fetch("http://localhost:3000/obter-resposta")
        .then(response => response.json())
        .then(data => {
            const resposta = data.resposta;
            if (resposta !== ultimaResposta) {
                ultimaResposta = resposta;
                enviarResposta(resposta);
            }
        })
        .catch(error => console.error("Erro ao buscar resposta:", error));
}

setInterval(verificarEClickarBotao, 1000);
setInterval(buscarResposta, 1000);
