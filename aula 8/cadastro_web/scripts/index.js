const formulario = document.querySelector("#cadastro");

formulario.addEventListener("submit", executar);

// Aplica as máscaras enquanto o usuário digita.
document.querySelector("#cpf").addEventListener("input", mascararCPF);
document.querySelector("#celular").addEventListener("input", mascararCelular);
document.querySelector("#cep").addEventListener("input", mascararCEP);

function executar(evento) {
  evento.preventDefault();
  limparErros();

  if (!validarForm()) {
    document.querySelector("#concluido").textContent =
      "Corrija os campos indicados antes de enviar o cadastro.";
    return;
  }

  chamarApi();
}

function validarForm() {
  let valido = true;

  const nome = valor("nome");
  if (nome.length < 3) {
    mostrarErro("nome", "Informe seu nome (mínimo de 3 caracteres).");
    valido = false;
  }

  const cpf = somenteNumeros(valor("cpf"));
  if (cpf.length !== 11) {
    mostrarErro("cpf", "Informe um CPF com 11 números.");
    valido = false;
  }

  const nascimento = valor("nascimento");
  if (!nascimento || new Date(nascimento + "T00:00:00") >= new Date()) {
    mostrarErro("nascimento", "Informe uma data de nascimento válida.");
    valido = false;
  }

  const idade = Number(valor("idade"));
  if (!valor("idade") || !Number.isInteger(idade) || idade < 18 || idade > 120) {
    mostrarErro("idade", "A idade deve ser um número entre 18 e 120 anos.");
    valido = false;
  }

  const celular = somenteNumeros(valor("celular"));
  if (celular.length !== 11) {
    mostrarErro("celular", "Informe um celular com DDD e 11 números.");
    valido = false;
  }

  const email = valor("email");
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formatoEmail.test(email)) {
    mostrarErro("email", "Informe um endereço de e-mail válido.");
    valido = false;
  }

  const senha = valor("senha");
  if (senha.length < 8) {
    mostrarErro("senha", "A senha deve ter pelo menos 8 caracteres.");
    valido = false;
  }

  if (valor("confirmarSenha") !== senha || !valor("confirmarSenha")) {
    mostrarErro("confirmarSenha", "As senhas não coincidem.");
    valido = false;
  }

  if (somenteNumeros(valor("cep")).length !== 8) {
    mostrarErro("cep", "Informe um CEP com 8 números.");
    valido = false;
  }

  if (valor("cidade").length < 2) {
    mostrarErro("cidade", "Informe sua cidade.");
    valido = false;
  }

  if (!valor("estado")) {
    mostrarErro("estado", "Selecione seu estado.");
    valido = false;
  }

  if (!document.querySelector("#termos").checked) {
    mostrarErro("termos", "É necessário aceitar os termos.");
    valido = false;
  }

  return valido;
}

async function chamarApi() {
  const dados = {
    nome: valor("nome"),
    cpf: somenteNumeros(valor("cpf")),
    nascimento: valor("nascimento"),
    idade: Number(valor("idade")),
    celular: somenteNumeros(valor("celular")),
    email: valor("email"),
    // A senha não é enviada para o serviço de demonstração.
    cep: somenteNumeros(valor("cep")),
    cidade: valor("cidade"),
    estado: valor("estado"),
    aceitouTermos: document.querySelector("#termos").checked
  };

  const botao = document.querySelector("#btn-enviar");
  botao.disabled = true;
  botao.textContent = "Enviando...";

  try {
    const resposta = await fetch("https://postman-echo.com/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }

    const resultado = await resposta.json();
    alert("Retorno da API:\n" + JSON.stringify(resultado, null, 2));
    document.querySelector("#concluido").textContent =
      "Cadastro enviado com sucesso!";
  } catch (erro) {
    alert("Não foi possível enviar o cadastro: " + erro.message);
  } finally {
    botao.disabled = false;
    botao.textContent = "Enviar cadastro";
  }
}

function valor(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function somenteNumeros(texto) {
  return texto.replace(/\D/g, "");
}

function mostrarErro(campo, mensagem) {
  const elemento = document.querySelector(`#erro-${campo}`);
  elemento.textContent = mensagem;
  elemento.classList.add("visivel");
  document.querySelector(`#${campo}`).classList.add("invalido");
}

function limparErros() {
  document.querySelectorAll(".mensagem-erro").forEach((elemento) => {
    elemento.textContent = "";
    elemento.classList.remove("visivel");
  });

  document.querySelectorAll(".invalido").forEach((elemento) => {
    elemento.classList.remove("invalido");
  });

  document.querySelector("#concluido").textContent = "";
}

function mascararCPF(evento) {
  const numeros = somenteNumeros(evento.target.value).slice(0, 11);
  let formatado = numeros;
  if (numeros.length > 9) {
    formatado = numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  } else if (numeros.length > 6) {
    formatado = numeros.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  } else if (numeros.length > 3) {
    formatado = numeros.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  }
  evento.target.value = formatado;
}

function mascararCelular(evento) {
  const numeros = somenteNumeros(evento.target.value).slice(0, 11);
  if (numeros.length > 7) {
    evento.target.value = numeros.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
  } else if (numeros.length > 2) {
    evento.target.value = numeros.replace(/(\d{2})(\d{1,5})/, "($1) $2");
  } else if (numeros.length > 0) {
    evento.target.value = `(${numeros}`;
  }
}

function mascararCEP(evento) {
  const numeros = somenteNumeros(evento.target.value).slice(0, 8);
  evento.target.value = numeros.length > 5
    ? numeros.replace(/(\d{5})(\d{1,3})/, "$1-$2")
    : numeros;
}
