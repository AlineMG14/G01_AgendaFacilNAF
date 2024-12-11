document.addEventListener("DOMContentLoaded", function () {
  const perfilForm = document.getElementById("perfilForm");
  const fotoPerfilInput = document.getElementById("fotoPerfil");
  const fotoPerfilPreview = document.getElementById("fotoPerfilPreview");
  const agendamentosListDiv = document.getElementById("agendamentosList");

  // Preenche o formulário com os dados do usuário logado
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuarioLogado) {
    document.getElementById("nomeCompleto").value = usuarioLogado.nomeCompleto;
    document.getElementById("email").value = usuarioLogado.email;
    document.getElementById("tipoUsuario").value = usuarioLogado.tipoUsuario;
    document.getElementById("dataNascimento").value =
      usuarioLogado.dataNascimento;
    document.getElementById("cpf").value = usuarioLogado.cpf;
    document.getElementById("telefone").value = usuarioLogado.telefone;
    document.getElementById("senha").value = usuarioLogado.senha;
    document.getElementById("confirmarSenha").value = usuarioLogado.senha;
    if (usuarioLogado.fotoPerfil) {
      fotoPerfilPreview.src = usuarioLogado.fotoPerfil;
      fotoPerfilPreview.style.display = "block";
    }
  }

  // Previsualiza a foto de perfil
  fotoPerfilInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        fotoPerfilPreview.src = e.target.result;
        fotoPerfilPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  perfilForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Coleta os valores dos campos
    const nomeCompleto = document.getElementById("nomeCompleto").value;
    const email = document.getElementById("email").value;
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    const dataNascimento = document.getElementById("dataNascimento").value;
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const fotoPerfil = fotoPerfilPreview.src;

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    // Atualiza os dados do usuário no localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioIndex = usuarios.findIndex(
      (usuario) => usuario.email === usuarioLogado.email
    );

    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex] = {
        ...usuarios[usuarioIndex],
        nomeCompleto,
        email,
        tipoUsuario,
        dataNascimento,
        cpf,
        telefone,
        senha,
        fotoPerfil,
      };

      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarios[usuarioIndex])
      );

      alert("Perfil atualizado com sucesso!");
      location.reload(); // Recarrega a página para atualizar os dados exibidos
    } else {
      alert("Erro ao atualizar o perfil. Usuário não encontrado.");
    }
  });

  // Exibe os agendamentos do usuário logado
  function exibirAgendamentos() {
    agendamentosListDiv.innerHTML = "";
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const agendamentosUsuario = agendamentos.filter(
      (agendamento) => agendamento.email === usuarioLogado.email
    );

    if (agendamentosUsuario.length > 0) {
      agendamentosUsuario.forEach((agendamento) => {
        const agendamentoItem = document.createElement("div");
        agendamentoItem.className = "agendamento-item";
        agendamentoItem.innerHTML = `
          <p><span>Data:</span> ${agendamento.data}</p>
          <p><span>Horário:</span> ${agendamento.horario}</p>
          <p><span>Tipo de Atendimento:</span> ${
            agendamento.tipoAtendimento
          }</p>
          <p><span>Atendimento:</span> ${agendamento.atendimento}</p>
          <p><span>Descrição:</span> ${agendamento.descricao}</p>
          <p><span>Status:</span> ${agendamento.status}</p>
          <p><span>Feedback:</span> ${
            agendamento.feedbackCidadao || "Nenhum feedback disponível"
          }</p>
          ${
            agendamento.status !== "cancelado" &&
            agendamento.status !== "finalizado"
              ? `<button onclick="cancelarAgendamento('${agendamento.id}')">Cancelar Agendamento</button>`
              : "<p>Agendamento cancelado ou finalizado</p>"
          }
          ${
            agendamento.status === "finalizado" && !agendamento.feedbackCidadao
              ? `<button onclick="fornecerFeedback('${agendamento.id}')">Fornecer Feedback</button>`
              : ""
          }
        `;
        agendamentosListDiv.appendChild(agendamentoItem);
      });
    } else {
      agendamentosListDiv.innerHTML =
        "<p>Você não tem agendamentos no momento.</p>";
    }
  }

  // Função para cancelar agendamento
  window.cancelarAgendamento = function (agendamentoId) {
    const confirmacao = confirm(
      "Tem certeza que deseja cancelar este agendamento?"
    );
    if (confirmacao) {
      const agendamentos =
        JSON.parse(localStorage.getItem("agendamentos")) || [];
      const agendamento = agendamentos.find(
        (agendamento) => agendamento.id === agendamentoId
      );

      if (agendamento && agendamento.status !== "finalizado") {
        agendamento.status = "cancelado";
        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
        alert("Agendamento cancelado com sucesso.");
        exibirAgendamentos(); // Atualiza a lista de agendamentos
      } else {
        alert("Não é possível cancelar um agendamento finalizado.");
      }
    }
  };

  // Função para fornecer feedback
  window.fornecerFeedback = function (agendamentoId) {
    const feedback = prompt(
      "Por favor, forneça seu feedback sobre o atendimento:"
    );
    if (feedback) {
      const agendamentos =
        JSON.parse(localStorage.getItem("agendamentos")) || [];
      const agendamentoIndex = agendamentos.findIndex(
        (ag) => ag.id === agendamentoId
      );

      if (agendamentoIndex !== -1) {
        agendamentos[agendamentoIndex].feedbackCidadao = feedback;
        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
        alert("Obrigado pelo seu feedback!");
        exibirAgendamentos(); // Atualiza a lista de agendamentos
      } else {
        alert("Agendamento não encontrado.");
      }
    }
  };

  exibirAgendamentos();
});
