// Cada perfil tem um numero, uma categoria e uma descrição.

const perfis = [
  {
    id: 1,
    nome: "Engenheiro de Sistemas",
    categoria: "Construção",
    descricao: "Responsável por projetar, desenvolver e construir sistemas e soluções tecnológicas para superar desafios.",
    imagem: "img/perfil-1.webp"
  },
  {
    id: 2,
    nome: "Cientista Explorador",
    categoria: "Investigação",
    descricao: "Investiga fenômenos, analisa dados e realiza experimentos para descobrir novas informações.",
    imagem: "img/perfil-2.avif"
  },
  {
    id: 3,
    nome: "Explorador de Campo",
    categoria: "Exploração",
    descricao: "Explora ambientes desconhecidos, observa o terreno e coleta informações importantes durante as expedições.",
    imagem: "img/perfil-3.webp"
  },
  {
    id: 4,
    nome: "Estrategista da Missão",
    categoria: "Planejamento",
    descricao: "Planeja operações, organiza recursos e define estratégias para alcançar os objetivos da missão.",
    imagem: "img/perfil-4.png"
  }
];


const formulario = document.getElementById("formulario");
const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const nascimento = document.getElementById("nascimento").value;

  if (nome === "" || nascimento === "") {
    mensagem.textContent = "Preencha seu nome e sua data de nascimento.";
    return;
  }

  const dataNascimento = new Date(nascimento + "T00:00:00");
  const hoje = new Date();

  if (dataNascimento > hoje) {
    mensagem.textContent = "A data de nascimento não pode ser uma data futura.";
    return;
  }

  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const diferencaMes = hoje.getMonth() - dataNascimento.getMonth();

  if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade = idade - 1;
  }

  const respostas = [];

  for (let numero = 1; numero <= 4; numero++) {
    const resposta = document.querySelector('input[name="pergunta' + numero + '"]:checked');

    if (resposta === null) {
      mensagem.textContent = "Responda todas as quatro perguntas.";
      return;
    }

    respostas.push(Number(resposta.value));
  }

  const pontos = [0, 0, 0, 0];

  for (let i = 0; i < respostas.length; i++) {
    pontos[respostas[i] - 1] = pontos[respostas[i] - 1] + 1;
  }

  let maiorPontuacao = pontos[0];

  for (let i = 1; i < pontos.length; i++) {
    if (pontos[i] > maiorPontuacao) {
      maiorPontuacao = pontos[i];
    }
  }

  const empatados = [];

  for (let i = 0; i < pontos.length; i++) {
    if (pontos[i] === maiorPontuacao) {
      empatados.push(i + 1);
    }
  }

  if (empatados.length > 1) {
    mensagem.textContent = "Suas respostas deram empate. Altere uma resposta e tente novamente.";
    resultado.hidden = true;
    return;
  }

  const idEscolhido = empatados[0];

  const perfilEscolhido = perfis.find(function(perfil) {
    return perfil.id === idEscolhido;
  });

  document.getElementById("dados-participante").textContent =
    nome + ", você tem " + idade + " anos.";

  document.getElementById("nome-perfil").textContent = perfilEscolhido.nome;
  document.getElementById("categoria-perfil").textContent =
    "Categoria: " + perfilEscolhido.categoria;
  document.getElementById("descricao-perfil").textContent = perfilEscolhido.descricao;
  document.getElementById("recomendacao-perfil").textContent = perfilEscolhido.recomendacao;
  document.getElementById("imagem-perfil").src = perfilEscolhido.imagem;
  document.getElementById("imagem-perfil").alt = "Ilustração de " + perfilEscolhido.nome;

  mensagem.textContent = "";
  resultado.hidden = false;
  resultado.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("refazer").addEventListener("click", function() {
  formulario.reset();
  mensagem.textContent = "";
  resultado.hidden = true;
  document.getElementById("nome").focus();
});
