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

    const idade = document.querySelector("#idade");
    const erroIdade = document.querySelector("#erro-idade");

    if (idade.value === "") {
        erroIdade.textContent = "Idade não pode estar vazio";
        erroIdade.classList.add("erro");
        erroIdade.classList.remove("oculto");
    } else if (Number(idade.value) < 18) {
        erroIdade.textContent = "É necessário ter 18 anos";
        erroIdade.classList.add("erro");
        erroIdade.classList.remove("oculto");
    }   
}

function limparErros() {
    document.querySelectorAll(".erro").forEach((elemento) => {
        elemento.classList.remove("erro");
        elemento.classList.add("oculto");
    });
}
