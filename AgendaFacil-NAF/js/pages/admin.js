document.addEventListener("DOMContentLoaded", function () {
  const cadastroForm = document.getElementById("cadastroForm");
  const userList = document
    .getElementById("userList")
    .getElementsByTagName("tbody")[0];
  const agendamentoList = document
    .getElementById("agendamentoList")
    .getElementsByTagName("tbody")[0];
  const detalhesModal = document.getElementById("detalhesModal");
  const closeModal = detalhesModal.getElementsByClassName("close")[0];
  const horariosDefinidosDiv = document.getElementById("horariosDefinidos");

  // Funcionalidade para cadastrar datas e horários disponíveis
  cadastroForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = document.getElementById("data").value;
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFim = document.getElementById("horaFim").value;

    if (new Date(`${data}T${horaInicio}`) >= new Date(`${data}T${horaFim}`)) {
      alert("A hora de início deve ser anterior à hora de término.");
      return;
    }

    const horariosDefinidos =
      JSON.parse(localStorage.getItem("horariosDefinidos")) || [];
    horariosDefinidos.push({ data, horaInicio, horaFim });
    localStorage.setItem(
      "horariosDefinidos",
      JSON.stringify(horariosDefinidos)
    );

    alert("Data e horário cadastrados com sucesso!");
    cadastroForm.reset();
    exibirHorarios();
  });

  // Função para listar usuários
  function listarUsuarios(usuarios = []) {
    userList.innerHTML = "";
    usuarios.forEach((usuario, index) => {
      const row = userList.insertRow();
      row.insertCell(0).textContent = index + 1;
      row.insertCell(1).textContent = usuario.nomeCompleto;
      row.insertCell(2).textContent = usuario.email;
      row.insertCell(3).textContent = usuario.telefone;
      row.insertCell(4).textContent = usuario.tipoUsuario;

      // Botão de Enviar email
      const emailBtn = document.createElement("button");
      emailBtn.textContent = "Enviar email";
      emailBtn.className = "email-button";
      emailBtn.addEventListener("click", () => abrirEmailModal(usuario.email));
      row.insertCell(5).appendChild(emailBtn);
    });
  }

  function abrirEmailModal(email) {
    const emailInput = document.getElementById("emailTo");
    emailInput.value = email;
    emailModal.style.display = "block";
  }

  const closeEmailModal = document.getElementById("closeEmailModal");
  closeEmailModal.addEventListener("click", function () {
    emailModal.style.display = "none";
  });

  const emailForm = document.getElementById("emailForm");
  emailForm.addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Email enviado com sucesso!");
    emailModal.style.display = "none";
  });

  // Função para pesquisar usuários
  function pesquisarUsuarios() {
    const filtroNome = document
      .getElementById("searchUser")
      .value.toLowerCase();
    const filtroTipo = document
      .getElementById("filterTipoUsuario")
      .value.toLowerCase();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuariosFiltrados = usuarios.filter((usuario) => {
      const nomeMatch =
        filtroNome === "" ||
        usuario.nomeCompleto.toLowerCase().includes(filtroNome);
      const tipoMatch =
        filtroTipo === "" || usuario.tipoUsuario.toLowerCase() === filtroTipo;
      return nomeMatch && tipoMatch;
    });
    listarUsuarios(usuariosFiltrados);
  }

  // Adicionar evento de clique ao botão de pesquisa
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", pesquisarUsuarios);

  // Inicializar a listagem de usuários
  listarUsuarios(JSON.parse(localStorage.getItem("usuarios")) || []);
});
document.addEventListener("DOMContentLoaded", function () {
  const agendamentoList = document
    .getElementById("agendamentoList")
    .getElementsByTagName("tbody")[0];
  const detalhesModal = document.getElementById("detalhesModal");
  const closeModal = detalhesModal.getElementsByClassName("close")[0];

  // Função para listar agendamentos
  function listarAgendamentos() {
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

    agendamentoList.innerHTML = "";
    agendamentos.forEach((agendamento, index) => {
      const row = agendamentoList.insertRow();
      row.insertCell(0).textContent = agendamento.id;
      row.insertCell(1).textContent = agendamento.nomeCompleto;
      row.insertCell(2).textContent = agendamento.data;
      row.insertCell(3).textContent = agendamento.horario;
      row.insertCell(4).textContent = agendamento.status;

      // Botão de detalhes
      const detalhesBtn = document.createElement("button");
      detalhesBtn.textContent = "Ver Detalhes";
      detalhesBtn.addEventListener("click", () =>
        mostrarDetalhes(agendamento.id)
      );
      row.insertCell(5).appendChild(detalhesBtn);
    });
  }

  // Mostrar detalhes de um agendamento
  function mostrarDetalhes(id) {
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const agendamento = agendamentos.find((ag) => ag.id === id);

    if (!agendamento) {
      alert("Agendamento não encontrado.");
      return;
    }

    const estudantes = JSON.parse(localStorage.getItem("usuarios")) || [];
    const estudante = estudantes.find(
      (usuario) => usuario.email === agendamento.estudanteAssociado
    );

    const professores = JSON.parse(localStorage.getItem("usuarios")) || [];
    const professor = professores.find(
      (usuario) => usuario.tipoUsuario === "professor"
    );

    const detalhesContent = document.getElementById("detalhesContent");
    detalhesContent.innerHTML = `
      <strong>Cidadão:</strong> ${agendamento.nomeCompleto}<br>
      <strong>Data:</strong> ${agendamento.data}<br>
      <strong>Hora:</strong> ${agendamento.horario}<br>
      <strong>Status:</strong> ${agendamento.status}<br>
      <strong>Tipo de Atendimento:</strong> ${agendamento.tipoAtendimento}<br>
      <strong>Descrição:</strong> ${agendamento.descricao}<br>
      <strong>Feedback Cidadão:</strong> ${
        agendamento.feedbackCidadao || "N/A"
      }<br>
      <strong>Estudante:</strong> ${
        estudante ? estudante.nomeCompleto : "N/A"
      }<br>
      <strong>Feedback Estudante:</strong> ${
        agendamento.observacoes || "Nenhum feedback disponível"
      }<br>
      <strong>Professor:</strong> ${
        professor ? professor.nomeCompleto : "N/A"
      }<br>
      <strong>Avaliação Professor:</strong> ${
        agendamento.avaliacaoProfessor || "Nenhuma avaliação disponível"
      }<br>
      <strong>Nota:</strong> ${agendamento.notaProfessor || "N/A"}<br>
    `;

    detalhesModal.style.display = "block";
  }

  // Fechar o modal de detalhes
  closeModal.addEventListener("click", function () {
    detalhesModal.style.display = "none";
  });

  // Função para exibir horários definidos
  function exibirHorarios() {
    const horariosDefinidos =
      JSON.parse(localStorage.getItem("horariosDefinidos")) || [];
    const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
    const horariosContainer = document.getElementById("horariosDefinidos");
    horariosContainer.innerHTML = "";

    horariosDefinidos.forEach((horario) => {
      const ocupado = agendamentos.some(
        (agendamento) =>
          agendamento.data === horario.data &&
          agendamento.horario === horario.horaInicio
      );

      const div = document.createElement("div");
      div.className = `horario-item ${ocupado ? "ocupado" : "disponivel"}`;
      div.innerHTML = `
        <h3>${horario.data}</h3>
        <p><strong>Início:</strong> ${horario.horaInicio}</p>
        <p><strong>Término:</strong> ${horario.horaFim}</p>
        <p><strong>Status:</strong> ${ocupado ? "Ocupado" : "Disponível"}</p>
      `;
      horariosContainer.appendChild(div);
    });
  }

  listarAgendamentos();
  exibirHorarios();

  // Exibir as mensagens de contato
  const contatoList = document.getElementById("contatoList");

  // Recuperar as mensagens de contato do localStorage
  let contatos = JSON.parse(localStorage.getItem("contatos")) || [];

  // Exibir as mensagens de contato
  if (contatos.length > 0) {
    contatos.forEach(function (contato) {
      const contatoItem = document.createElement("div");
      contatoItem.classList.add("contato-item");
      contatoItem.innerHTML = `
        <h3>${contato.nome}</h3>
        <p><strong>Email:</strong> ${contato.email}</p>
        <p><strong>Mensagem:</strong> ${contato.mensagem}</p>
        <p><strong>Data:</strong> ${contato.data}</p>
      `;
      contatoList.appendChild(contatoItem);
    });
  } else {
    contatoList.innerHTML = "<p>Nenhuma mensagem de contato encontrada.</p>";
  }
});
