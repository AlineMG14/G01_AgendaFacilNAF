document.addEventListener("DOMContentLoaded", function () {
  const agendamentosListDisponiveisDiv = document.getElementById(
    "agendamentosListDisponiveis"
  );
  const agendamentosAssociadosDiv = document.getElementById(
    "agendamentosListAssociados"
  );
  const feedbackListDiv = document.getElementById("feedbackList");
  const apoioForm = document.getElementById("apoioForm");

  // Verifica se o usuário está logado e se é estudante
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado || usuarioLogado.tipoUsuario !== "estudante") {
    alert("Acesso negado. Somente estudantes podem acessar esta página.");
    window.location.href = "login.html"; // Redireciona para a página de login
    return;
  }

  // Exibe os agendamentos disponíveis
  function exibirAgendamentosDisponiveis() {
    agendamentosListDisponiveisDiv.innerHTML = "";
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const agendamentosDisponiveis = agendamentos.filter(
      (agendamento) => agendamento.status === "agendado"
    );

    if (agendamentosDisponiveis.length > 0) {
      agendamentosDisponiveis.forEach((agendamento) => {
        const agendamentoItem = document.createElement("div");
        agendamentoItem.className = "item";
        agendamentoItem.innerHTML = `
          <p><span>Nome Completo:</span> ${agendamento.nomeCompleto}</p>
          <p><span>Tipo de Atendimento:</span> ${agendamento.tipoAtendimento}</p>
          <p><span>Atendimento:</span> ${agendamento.atendimento}</p>
          <p><span>Descrição:</span> ${agendamento.descricao}</p>
          <p><span>Data:</span> ${agendamento.data}</p>
          <p><span>Horário:</span> ${agendamento.horario}</p>
          <p><span>Status:</span> ${agendamento.status}</p>
          <button onclick="associarEstudante('${agendamento.id}')">Associar</button>
        `;
        agendamentosListDisponiveisDiv.appendChild(agendamentoItem);
      });
    } else {
      agendamentosListDisponiveisDiv.innerHTML =
        "<p>Não há agendamentos disponíveis no momento.</p>";
    }
  }

  // Exibe os agendamentos associados ao estudante
  function exibirAgendamentosAssociados() {
    agendamentosAssociadosDiv.innerHTML = "";
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const agendamentosAssociados = agendamentos.filter(
      (agendamento) => agendamento.estudanteAssociado === usuarioLogado.email
    );

    agendamentosAssociados.forEach((agendamento) => {
      const agendamentoItem = document.createElement("div");
      agendamentoItem.className = "item";
      agendamentoItem.innerHTML = `
        <p><span>Nome Completo:</span> ${agendamento.nomeCompleto}</p>
        <p><span>Tipo de Atendimento:</span> ${agendamento.tipoAtendimento}</p>
        <p><span>Atendimento:</span> ${agendamento.atendimento}</p>
        <p><span>Descrição:</span> ${agendamento.descricao}</p>
        <p><span>Data:</span> ${agendamento.data}</p>
        <p><span>Horário:</span> ${agendamento.horario}</p>
        <p><span>Status:</span> ${agendamento.status}</p>
        <p><span>Solicitação de Apoio:</span> ${
          agendamento.solicitacaoApoio || "Nenhuma solicitação de apoio"
        }</p>
      `;
      if (agendamento.status === "associado") {
        agendamentoItem.innerHTML += `
          <button onclick="confirmarAgendamento('${agendamento.id}')">Confirmar</button>
          <button onclick="solicitarApoio('${agendamento.id}')">Solicitar Apoio</button>
        `;
      } else if (agendamento.status === "confirmado") {
        agendamentoItem.innerHTML += `<button onclick="finalizarAgendamento('${agendamento.id}')">Finalizar</button>`;
      }
      agendamentosAssociadosDiv.appendChild(agendamentoItem);
    });
  }

  // Exibe os agendamentos finalizados com feedback
  function exibirAgendamentosFinalizados() {
    feedbackListDiv.innerHTML = "";
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const agendamentosFinalizados = agendamentos.filter(
      (agendamento) =>
        agendamento.status === "finalizado" &&
        agendamento.estudanteAssociado === usuarioLogado.email
    );

    agendamentosFinalizados.forEach((agendamento) => {
      const agendamentoItem = document.createElement("div");
      agendamentoItem.className = "item";
      agendamentoItem.innerHTML = `
        <p><span>Nome Completo:</span> ${agendamento.nomeCompleto}</p>
        <p><span>Tipo de Atendimento:</span> ${agendamento.tipoAtendimento}</p>
        <p><span>Atendimento:</span> ${agendamento.atendimento}</p>
        <p><span>Descrição:</span> ${agendamento.descricao}</p>
        <p><span>Data:</span> ${agendamento.data}</p>
        <p><span>Horário:</span> ${agendamento.horario}</p>
        <p><span>Observações:</span> ${
          agendamento.observacoes || "Nenhuma observação disponível"
        }</p>
        <p><span>Feedback do Cidadão:</span> ${
          agendamento.feedbackCidadao || "Nenhum feedback disponível"
        }</p>
        <p><span>Avaliação do Professor:</span> ${
          agendamento.avaliacaoProfessor || "Nenhuma avaliação disponível"
        }</p>
      `;
      feedbackListDiv.appendChild(agendamentoItem);
    });
  }

  // Função para associar o estudante ao agendamento
  window.associarEstudante = function (agendamentoId) {
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const agendamentoIndex = agendamentos.findIndex(
      (ag) => ag.id === agendamentoId
    );

    if (agendamentoIndex !== -1) {
      agendamentos[agendamentoIndex].estudanteAssociado = usuarioLogado.email;
      agendamentos[agendamentoIndex].status = "associado";
      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
      alert("Você se associou ao agendamento com sucesso!");
      exibirAgendamentosDisponiveis();
      exibirAgendamentosAssociados();
    } else {
      alert("Agendamento não encontrado.");
    }
  };

  // Função para confirmar o agendamento
  window.confirmarAgendamento = function (agendamentoId) {
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const agendamentoIndex = agendamentos.findIndex(
      (ag) => ag.id === agendamentoId
    );

    if (agendamentoIndex !== -1) {
      agendamentos[agendamentoIndex].status = "confirmado";
      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
      alert("Agendamento confirmado com sucesso!");
      exibirAgendamentosAssociados();
    } else {
      alert("Agendamento não encontrado.");
    }
  };

  // Função para finalizar o agendamento
  window.finalizarAgendamento = function (agendamentoId) {
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const agendamentoIndex = agendamentos.findIndex(
      (ag) => ag.id === agendamentoId
    );

    if (agendamentoIndex !== -1) {
      const observacoes = prompt(
        "Digite as suas observações para o atendimento:"
      );
      if (observacoes !== null) {
        agendamentos[agendamentoIndex].status = "finalizado";
        agendamentos[agendamentoIndex].observacoes = observacoes;
        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
        alert("Agendamento finalizado com sucesso!");
        exibirAgendamentosAssociados();
        exibirAgendamentosFinalizados();
      }
    } else {
      alert("Agendamento não encontrado.");
    }
  };

  // Função para solicitar apoio ao professor
  window.solicitarApoio = function (agendamentoId) {
    const descricaoApoio = prompt("Descreva o apoio que você precisa:");
    if (descricaoApoio !== null) {
      const agendamentos =
        JSON.parse(localStorage.getItem("agendamentos")) || [];
      const agendamentoIndex = agendamentos.findIndex(
        (ag) => ag.id === agendamentoId
      );

      if (agendamentoIndex !== -1) {
        agendamentos[agendamentoIndex].solicitouApoio = true;
        agendamentos[agendamentoIndex].descricaoApoio = descricaoApoio;
        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
        alert("Solicitação de apoio enviada com sucesso!");
        exibirAgendamentosAssociados();
      } else {
        alert("Agendamento não encontrado.");
      }
    }
  };

  exibirAgendamentosDisponiveis();
  exibirAgendamentosAssociados();
  exibirAgendamentosFinalizados();
});
