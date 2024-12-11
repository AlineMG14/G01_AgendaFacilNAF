document.addEventListener("DOMContentLoaded", function () {
  const avaliacaoForm = document.getElementById("avaliacaoForm");
  const estrelas = document.querySelectorAll(".estrela");
  let nota = 0;

  estrelas.forEach((estrela) => {
    estrela.addEventListener("click", () => {
      nota = estrela.getAttribute("data-value");
      estrelas.forEach((el, index) => {
        el.classList.toggle("selecionada", index < nota);
      });
    });
  });

  avaliacaoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const depoimento = document.getElementById("depoimento").value;

    if (nota === 0) {
      alert("Por favor, selecione uma avaliação com estrelas.");
      return;
    }

    const avaliacao = {
      nome,
      nota,
      depoimento,
      data: new Date().toLocaleDateString(),
    };

    const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];
    avaliacoes.push(avaliacao);
    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));

    alert("Obrigado pela sua avaliação!");

    // Limpar o formulário
    avaliacaoForm.reset();
    estrelas.forEach((estrela) => estrela.classList.remove("selecionada"));
    nota = 0;

    exibirAvaliacoesRecentes();
  });

  function exibirAvaliacoesRecentes(filtroNota = "todos") {
    const avaliacoesDiv = document.getElementById("avaliacoesRecentes");
    let avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];

    // Ordenar as avaliações por data mais recente
    avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

    // Filtrar avaliações por quantidade de estrelas se um filtro for aplicado
    if (filtroNota !== "todos") {
      avaliacoes = avaliacoes.filter(
        (avaliacao) => avaliacao.nota == filtroNota
      );
    }

    avaliacoesDiv.innerHTML = "";

    if (avaliacoes.length === 0) {
      avaliacoesDiv.innerHTML =
        "<p>Não há avaliações para mostrar no momento.</p>";
      return;
    }

    avaliacoes.forEach((avaliacao) => {
      const avaliacaoItem = document.createElement("div");
      avaliacaoItem.className = "avaliacao-item";
      avaliacaoItem.innerHTML = `
          <div class="avaliacao-header">
            <p><strong>${avaliacao.nome}</strong> (${avaliacao.data})</p>
            <p>${"★".repeat(avaliacao.nota)}${"☆".repeat(
        5 - avaliacao.nota
      )}</p>
          </div>
          <p>${avaliacao.depoimento}</p>
        `;
      avaliacoesDiv.appendChild(avaliacaoItem);
    });
  }

  // Função para adicionar o evento de clique aos filtros
  function adicionarEventosDeFiltro() {
    const filtros = document.querySelectorAll(".filtro");
    filtros.forEach((filtro) => {
      filtro.addEventListener("click", () => {
        const filtroNota = filtro.getAttribute("data-value");
        exibirAvaliacoesRecentes(filtroNota);
      });
    });
  }

  adicionarEventosDeFiltro();

  exibirAvaliacoesRecentes();
});
