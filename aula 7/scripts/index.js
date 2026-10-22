function executar(evento) {
    evento.preventDefault();
    limparErros();

    const nome = document.querySelector("#nome");
    const erroNome = document.querySelector("#erro-nome");

    if (nome.value === "") {
        erroNome.textContent = "nome não pode estar vazio!";
        erroNome.classList.add("erro");
        erroNome.classList.remove("oculto");
    } else {
        alert("Cadastro Concluído!")
    }
    
}

function limparErros() {
    document.querySelectorAll(".erro").forEach((elemento) => {
        elemento.classList.remove("erro");
        elemento.classList.add("oculto");
    });
}