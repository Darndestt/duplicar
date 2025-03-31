let palavraEnviada = "";
let ultimaRodada = "";
let ultimaResposta = "";
let contaPrincipal = false;
let acertou = false;

function botaoContaPrincipal() {
    const botao = document.createElement("button");
    botao.textContent = "Conta Principal";
    
    botao.style.position = "fixed";
    botao.style.top = "10px";
    botao.style.right = "10px";
    botao.style.zIndex = "9999";
    botao.style.padding = "10px 20px";
    botao.style.fontSize = "16px";
    botao.style.fontWeight = "bold";
    botao.style.border = "none";
    botao.style.borderRadius = "3px";
    botao.style.cursor = "pointer";
    botao.style.transition = "all 0.3s ease";
    botao.style.background = "#ff4d4d";
    botao.style.color = "white";

    document.body.appendChild(botao);

    botao.addEventListener("click", () => {
        fetch("http://localhost:3000/setPrincipal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ principal: true })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Conta principal:", data);
            contaPrincipal = true;
        })
        .catch(error => console.error("Erro ao definir conta principal:", error));
    });

    setInterval(() => {
        fetch("http://localhost:3000/getPrincipal", { credentials: "include" })
            .then(response => response.json())
            .then(data => {
                contaPrincipal = data.principal;

                botao.style.background = contaPrincipal ? "#4CAF50" : "#ff4d4d";
            })
            .catch(error => console.error("Erro ao verificar conta principal:", error));
    }, 1000);
}

function enviarPalavra(palavra) {
    fetch("http://localhost:3000/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resposta: palavra })
    })
    .then(response => response.text())
    .then(data => {
        palavraEnviada = palavra;
    })
    .catch(error => console.error("Erro ao enviar palavra:", error));
}

function clickarBotao() {
    const alerta = document.querySelector("#alerta");
    const desenharBtn = document.querySelector("#desenhar");
    const texto1 = alerta?.querySelector(".texto1");

    if (texto1 && texto1.textContent.trim() === "Sua vez") {
        desenharBtn.click();

        const todasAsVezes = document.querySelectorAll(".vez");
        if (todasAsVezes.length > 0) {
            for (let i = todasAsVezes.length - 1; i >= 0; i--) {
                const texto = todasAsVezes[i].textContent.trim();

                if (texto.startsWith("Sua vez, a palavra é:")) {
                    const palavra = todasAsVezes[i].querySelector("strong")?.textContent.trim();
                    console.log("Palavra da vez:", palavra);

                    if (palavra && palavra !== palavraEnviada) {
                        enviarPalavra(palavra);
                    }

                    ultimaRodada = palavra;
                    break;
                }
            }
        }
    }
}

function verificarAcerto() {
    const acertos = document.querySelectorAll(".acerto");
    for (let i = acertos.length - 1; i >= 0; i--) {
        const texto = acertos[i].textContent.trim();
        if (texto.startsWith("Você acertou:")) {
            acertos[i].remove();
            acertou = true;
            break;
        }
    }
}

function enviarResposta() {

    if (acertou) return;

    fetch("http://localhost:3000/get")
        .then(response => response.json())
        .then(data => {
            const resposta = data.resposta;
            console.log("Nova resposta recebida do servidor:", resposta);

            const input = document.querySelector('#respostas input');

            if (input && resposta) {
                input.value = resposta;

                input.dispatchEvent(new Event('input', { bubbles: true }));

                const enviarBtn = document.querySelector('#respostas form');
                if (enviarBtn) {
                    if (contaPrincipal) {
                        enviarBtn.dispatchEvent(new Event('submit', { bubbles: true }));
                    } else {
                        setTimeout(() => {
                            enviarBtn.dispatchEvent(new Event('submit', { bubbles: true }));
                        }, 2000);
                    }
                }
            }
        })
        .catch(error => console.error("Erro ao buscar resposta:", error));
}

botaoContaPrincipal();

setInterval(enviarResposta, 1000);
setInterval(clickarBotao, 1000);
setInterval(verificarAcerto, 1000);
