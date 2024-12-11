document.addEventListener("DOMContentLoaded", function () {
  const finalizadosListDiv = document.getElementById("finalizadosList");

  // Verifica se o usuário está logado e se é professor
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado || usuarioLogado.tipoUsuario !== "professor") {
    alert("Acesso negado. Somente professores podem acessar esta página.");
    window.location.href = "login.html"; // Redireciona para a página de login
    return;
  }

  console.log("Usuário logado:", usuarioLogado);

  // Exibe os atendimentos
  function exibirAtendimentos(filtro = "todos") {
    finalizadosListDiv.innerHTML = "";
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    console.log("Agendamentos carregados:", agendamentos);

    let atendimentosFiltrados;

    if (filtro === "avaliados") {
      atendimentosFiltrados = agendamentos.filter(
        (agendamento) =>
          agendamento.status === "finalizado" && agendamento.avaliacaoProfessor
      );
    } else if (filtro === "naoAvaliados") {
      atendimentosFiltrados = agendamentos.filter(
        (agendamento) =>
          agendamento.status === "finalizado" && !agendamento.avaliacaoProfessor
      );
    } else if (filtro === "apoio") {
      atendimentosFiltrados = agendamentos.filter(
        (agendamento) => agendamento.solicitouApoio
      );
    } else if (filtro === "agendado") {
      atendimentosFiltrados = agendamentos.filter(
        (agendamento) => agendamento.status === "agendado"
      );
    } else if (filtro === "confirmado") {
      atendimentosFiltrados = agendamentos.filter(
        (agendamento) => agendamento.status === "confirmado"
      );
    } else {
      atendimentosFiltrados = agendamentos;
    }

    console.log("Atendimentos após filtro:", atendimentosFiltrados);

    if (atendimentosFiltrados.length > 0) {
      atendimentosFiltrados.forEach((agendamento) => {
        const estudante = obterDadosEstudante(agendamento.estudanteAssociado);
        console.log("Dados do estudante:", estudante);

        const agendamentoItem = document.createElement("div");
        agendamentoItem.className = "item";
        agendamentoItem.innerHTML = `
          <p><span>Nome do Estudante:</span> ${estudante.nomeCompleto}</p>
          <p><span>Nome Completo do Cidadão:</span> ${
            agendamento.nomeCompleto
          }</p>
          <p><span>Tipo de Atendimento:</span> ${
            agendamento.tipoAtendimento
          }</p>
          <p><span>Atendimento:</span> ${agendamento.atendimento}</p>
          <p><span>Descrição:</span> ${agendamento.descricao}</p>
          <p><span>Data:</span> ${agendamento.data}</p>
          <p><span>Horário:</span> ${agendamento.horario}</p>
          <p><span>Status:</span> ${agendamento.status}</p>
          <p><span>Solicitação de Apoio:</span> ${
            agendamento.descricaoApoio || "Nenhuma solicitação de apoio"
          }</p>
          <p><span>Observações do Estudante:</span> ${
            agendamento.observacoes || "Nenhuma observação disponível"
          }</p>
          <p><span>Feedback do Cidadão:</span> ${
            agendamento.feedbackCidadao || "Nenhum feedback disponível"
          }</p>
          ${
            agendamento.status === "finalizado"
              ? `
                  <textarea id="avaliacao-${
                    agendamento.id
                  }" placeholder="Digite sua avaliação...">${
                  agendamento.avaliacaoProfessor || ""
                }</textarea>
                  <input type="number" id="nota-${
                    agendamento.id
                  }" placeholder="Nota (0-10)" value="${
                  agendamento.notaProfessor || ""
                }" min="0" max="10">
                  <button onclick="salvarAvaliacao('${
                    agendamento.id
                  }')">Salvar Avaliação</button>
                `
              : `<p>Avaliações e notas só podem ser dadas após o agendamento ser finalizado.</p>`
          }
        `;
        if (agendamento.avaliacaoProfessor) {
          agendamentoItem.querySelector("textarea").disabled = true;
          agendamentoItem.querySelector("input").disabled = true;
          agendamentoItem.querySelector("button").style.display = "none";
        }
        finalizadosListDiv.appendChild(agendamentoItem);
      });
    } else {
      finalizadosListDiv.innerHTML = "<p>Não há atendimentos no momento.</p>";
    }
  }

  // Função para obter dados do estudante
  function obterDadosEstudante(email) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const estudante = usuarios.find((usuario) => usuario.email === email) || {};
    console.log("Dados do estudante obtidos:", estudante);
    return estudante;
  }

  // Função para salvar a avaliação
  window.salvarAvaliacao = function (agendamentoId) {
    const avaliacao = document.getElementById(
      `avaliacao-${agendamentoId}`
    ).value;
    const nota = document.getElementById(`nota-${agendamentoId}`).value;
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const agendamentoIndex = agendamentos.findIndex(
      (ag) => ag.id === agendamentoId
    );

    if (agendamentoIndex !== -1) {
      agendamentos[agendamentoIndex].avaliacaoProfessor = avaliacao;
      agendamentos[agendamentoIndex].notaProfessor = nota;
      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
      alert("Avaliação salva com sucesso!");
      exibirAtendimentos();
    } else {
      alert("Agendamento não encontrado.");
    }
  };

  // Função para filtrar atendimentos
  window.filtrarAtendimentos = function (filtro) {
    console.log("Filtro selecionado:", filtro);
    exibirAtendimentos(filtro);
  };

  // Exibir os atendimentos ao carregar a página
  exibirAtendimentos();
});
