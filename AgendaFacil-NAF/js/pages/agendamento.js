document.addEventListener("DOMContentLoaded", function () {
  const agendamentoForm = document.getElementById("agendamentoForm");
  const consentimentoLink = document.getElementById("mostrarConsentimento");
  const consentimentoModal = document.getElementById("consentimentoModal");
  const closeConsentimentoModal = document.getElementsByClassName("close")[0];
  const confirmacaoModal = document.getElementById("confirmacaoModal");
  const closeConfirmacaoModal =
    document.getElementsByClassName("close-confirmacao")[0];
  const dataInput = document.getElementById("data");
  const horarioInput = document.getElementById("horario");

  // Abrir o modal "Consentimento"
  consentimentoLink.addEventListener("click", function (event) {
    event.preventDefault();
    consentimentoModal.style.display = "block";
  });

  // Fechar o modal "Consentimento"
  closeConsentimentoModal.addEventListener("click", function () {
    consentimentoModal.style.display = "none";
  });

  // Fechar o modal "Confirmação"
  closeConfirmacaoModal.addEventListener("click", function () {
    confirmacaoModal.style.display = "none";
    window.location.href = "index.html";
  });

  // Fechar os modais clicando fora da caixa de conteúdo
  window.addEventListener("click", function (event) {
    if (event.target == consentimentoModal) {
      consentimentoModal.style.display = "none";
    }
    if (event.target == confirmacaoModal) {
      confirmacaoModal.style.display = "none";
      window.location.href = "index.html";
    }
  });

  // Preencher o nome completo do usuário logado
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    alert("Você deve estar logado para agendar um atendimento.");
    window.location.href = "login.html";
    return;
  }
  if (usuarioLogado.tipoUsuario !== "cidadão") {
    alert("Apenas cidadãos podem agendar atendimentos.");
    window.location.href = "index.html";
    return;
  }
  document.getElementById("nomeCompleto").value = usuarioLogado.nomeCompleto;

  // Verificar se o usuário já possui agendamentos em aberto
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  const agendamentosAbertos = agendamentos.some(
    (agendamento) =>
      agendamento.email === usuarioLogado.email &&
      agendamento.status !== "finalizado" &&
      agendamento.status !== "cancelado"
  );
  if (agendamentosAbertos) {
    alert(
      "Você já possui um agendamento em aberto. Finalize-o antes de agendar um novo."
    );
    window.location.href = "index.html";
    return;
  }

  // Carregar datas e horários disponíveis do localStorage
  const horariosDefinidos =
    JSON.parse(localStorage.getItem("horariosDefinidos")) || [];

  // Filtrar as datas com horários disponíveis
  const datasDisponiveis = [
    ...new Set(horariosDefinidos.map((horario) => horario.data)),
  ].filter((data) => {
    return horariosDefinidos.some(
      (horarioDefinido) =>
        !agendamentos.some(
          (agendamento) =>
            agendamento.data === horarioDefinido.data &&
            agendamento.horario === horarioDefinido.horaInicio
        ) && horarioDefinido.data === data
    );
  });

  // Usar Flatpickr para datas disponíveis
  flatpickr(dataInput, {
    dateFormat: "Y-m-d",
    enable: datasDisponiveis,
    onChange: function (selectedDates, dateStr) {
      // Filtrar horários disponíveis para a data selecionada
      const horariosParaData = horariosDefinidos
        .filter((horario) => horario.data === dateStr)
        .filter(
          (horario) =>
            !agendamentos.some(
              (agendamento) =>
                agendamento.data === dateStr &&
                agendamento.horario === horario.horaInicio
            )
        )
        .map((horario) => horario.horaInicio);

      // Limpar horários anteriores
      horarioInput.innerHTML = "";

      if (horariosParaData.length > 0) {
        horariosParaData.forEach((horario) => {
          const option = document.createElement("option");
          option.value = horario;
          option.textContent = horario;
          horarioInput.appendChild(option);
        });
      } else {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Nenhum horário disponível";
        option.disabled = true;
        horarioInput.appendChild(option);
      }
    },
  });

  agendamentoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Coletar os valores dos campos
    const nomeCompleto = document.getElementById("nomeCompleto").value;
    const tipoAtendimento = document.getElementById("tipoAtendimento").value;
    const atendimento = document.getElementById("atendimento").value;
    const descricao = document.getElementById("descricao").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const email = usuarioLogado.email;
    const id = Date.now().toString(); // Gerar um ID único usando timestamp

    // Verificar se o consentimento foi marcado
    const consentimento = document.getElementById("consentimento").checked;
    if (!consentimento) {
      alert(
        "Você deve concordar com os termos e condições para agendar um atendimento."
      );
      return;
    }

    // Verificar se o horário já está agendado
    const horarioOcupado = agendamentos.some(
      (agendamento) =>
        agendamento.data === data && agendamento.horario === horario
    );
    if (horarioOcupado) {
      alert(
        "O horário selecionado já está ocupado. Por favor, escolha outro horário."
      );
      return;
    }

    // Cria o objeto agendamento com os dados
    const agendamento = {
      id, // Adicionar ID único
      nomeCompleto,
      tipoAtendimento,
      atendimento,
      descricao,
      data,
      horario,
      email,
      status: "agendado", // Definir o status como "Agendado"
    };

    agendamentos.push(agendamento);
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

    // Mostrar modal de confirmação
    confirmacaoModal.style.display = "block";
  });
});
