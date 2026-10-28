function switchTab(tabId) {
    const paginas = ["inicio", "conversor", "integrantes"];

    paginas.forEach((pagina) => {
        const secao = document.getElementById(`page-${pagina}`);
        const botao = document.getElementById(`nav-${pagina}`);

        if (secao) secao.classList.toggle("escondido", pagina !== tabId);
        if (botao) botao.classList.toggle("ativo", pagina === tabId);
    });
}

async function converterPartindoDe(origem) {
    const campos = {
        decimal: document.getElementById("input-decimal"),
        binario: document.getElementById("input-binario"),
        hexadecimal: document.getElementById("input-hexadecimal"),
        octal: document.getElementById("input-octal")
    };

    const valor = campos[origem].value.trim();
    const erro = document.getElementById("erro");
    const resultado = document.getElementById("resultado");

    erro.textContent = "";
    erro.classList.add("escondido");
    resultado.classList.add("escondido");

    if (!valor) {
        mostrarErro("Digite um valor antes de converter.");
        campos[origem].focus();
        return;
    }

    try {
        const resposta = await fetch("/converter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ origem: origem, valor: valor })
        });

        const textoResposta = await resposta.text();
        let dados;

        try {
            dados = textoResposta ? JSON.parse(textoResposta) : {};
        } catch {
            throw new Error(
                `O servidor retornou uma resposta que não é JSON (HTTP ${resposta.status}). Confira o terminal do Flask.`
            );
        }

        if (!resposta.ok) {
            throw new Error(dados.erro || `Erro do servidor (HTTP ${resposta.status}).`);
        }

        if (!dados || typeof dados.decimal === "undefined") {
            throw new Error("O servidor respondeu, mas não enviou os resultados da conversão.");
        }

        document.getElementById("mensagem-resultado").textContent =
            `Valor informado: ${dados.entrada} (base ${origem}).`;

        ["decimal", "binario", "hexadecimal", "octal"].forEach((baseNome) => {
            document.getElementById(`res-${baseNome}`).textContent = dados[baseNome];
            campos[baseNome].value = dados[baseNome];
        });

        resultado.classList.remove("escondido");
    } catch (erroRecebido) {
        mostrarErro(erroRecebido.message || "Não foi possível conectar ao servidor Flask.");
    }

    function mostrarErro(mensagem) {
        erro.textContent = mensagem;
        erro.classList.remove("escondido");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".cartao input").forEach((campo) => {
        campo.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter") {
                const origem = campo.id.replace("input-", "");
                converterPartindoDe(origem);
            }
        });
    });
});
