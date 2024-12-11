document.addEventListener("DOMContentLoaded", function () {
  const cadastroForm = document.getElementById("cadastroForm");
  const tipoUsuarioSelect = document.getElementById("tipoUsuario");
  const camposAdicionaisDiv = document.getElementById("camposAdicionais");
  const termosLink = document.getElementById("mostrarTermos");
  const termosModal = document.getElementById("termosModal");
  const closeModal = document.getElementsByClassName("close")[0];
  const validacaoModal = document.getElementById("validacaoModal");
  const closeModalValidacao =
    document.getElementsByClassName("close-validacao")[0];

  // Abrir o modal "Termos e Condições"
  termosLink.addEventListener("click", function (event) {
    event.preventDefault();
    termosModal.style.display = "block";
  });

  // Fechar o modal "Termos e Condições"
  closeModal.addEventListener("click", function () {
    termosModal.style.display = "none";
  });

  // Fechar o modal "Validação de Identidade"
  closeModalValidacao.addEventListener("click", function () {
    validacaoModal.style.display = "none";
  });

  // Fechar os modais clicando fora da caixa de conteúdo
  window.addEventListener("click", function (event) {
    if (event.target == termosModal) {
      termosModal.style.display = "none";
    }
    if (event.target == validacaoModal) {
      validacaoModal.style.display = "none";
    }
  });

  // Atualiza os campos adicionais conforme o tipo de usuário selecionado
  tipoUsuarioSelect.addEventListener("change", function () {
    console.log("Tipo de usuário selecionado:", this.value);
    atualizarCamposAdicionais(this.value);
  });

  // Lida com o envio do formulário de cadastro
  cadastroForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const termosCheckbox = document.getElementById("termos");
    if (!termosCheckbox.checked) {
      alert("Você deve concordar com os termos e condições para se cadastrar.");
      return;
    }

    // Coleta os valores dos campos
    const tipoUsuario = document.getElementById("tipoUsuario").value;
    const nomeCompleto = document.getElementById("nomeCompleto").value;
    const dataNascimento = document.getElementById("dataNascimento").value;
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    // Recupera os usuários do localStorage ou inicializa com um array vazio
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se o CPF ou e-mail já estão cadastrados
    const cpfExistente = usuarios.some((usuario) => usuario.cpf === cpf);
    const emailExistente = usuarios.some((usuario) => usuario.email === email);
    if (cpfExistente) {
      alert("CPF já cadastrado. Por favor, utilize outro CPF.");
      return;
    }
    if (emailExistente) {
      alert("E-mail já cadastrado. Por favor, utilize outro e-mail.");
      return;
    }

    const usuario = {
      tipoUsuario,
      nomeCompleto,
      dataNascimento,
      cpf,
      telefone,
      email,
      senha,
      camposAdicionais: coletarCamposAdicionais(tipoUsuario),
    };

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    if (
      tipoUsuario === "estudante" ||
      tipoUsuario === "professor" ||
      tipoUsuario === "administrador"
    ) {
      validacaoModal.style.display = "block"; // Mostrar modal de validação
    } else {
      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";
    }
  });

  // Atualiza os campos adicionais com base no tipo de usuário
  function atualizarCamposAdicionais(tipoUsuario) {
    console.log("Atualizando campos adicionais para:", tipoUsuario);
    camposAdicionaisDiv.innerHTML = "";

    // Campos comuns a todos os tipos de usuário
    let camposComuns = `
      <div class="form-group full-width">
        <label for="nomeCompleto">Nome Completo:</label>
        <input type="text" id="nomeCompleto" name="nomeCompleto" required>
      </div>
      <div class="form-group full-width">
        <label for="dataNascimento">Data de Nascimento:</label>
        <input type="date" id="dataNascimento" name="dataNascimento" required>
      </div>
      <div class="form-group full-width">
        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" name="cpf" required>
      </div>
      <div class="form-group full-width">
        <label for="telefone">Telefone:</label>
        <input type="tel" id="telefone" name="telefone" required>
      </div>
    `;

    if (tipoUsuario === "estudante") {
      camposAdicionaisDiv.innerHTML =
        camposComuns +
        `
        <div class="form-group full-width">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group full-width">
          <label for="matricula">Matrícula:</label>
          <input type="text" id="matricula" name="matricula" required>
        </div>
        <div class="form-group full-width">
          <label for="curso">Curso:</label>
          <input type="text" id="curso" name="curso" required>
        </div>
        <div class="form-group full-width">
          <label for="polo">Polo:</label>
          <input type="text" id="polo" name="polo" required>
        </div>
        <div class="form-group full-width">
          <label for="senha">Senha:</label>
          <input type="password" id="senha" name="senha" required>
        </div>
        <div class="form-group full-width">
          <label for="confirmarSenha">Confirmar Senha:</label>
          <input type="password" id="confirmarSenha" name="confirmarSenha" required>
        </div>
      `;
    } else if (tipoUsuario === "professor") {
      camposAdicionaisDiv.innerHTML =
        camposComuns +
        `
        <div class="form-group full-width">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group full-width">
          <label for="registro">Registro:</label>
          <input type="text" id="registro" name="registro" required>
        </div>
        <div class="form-group full-width">
          <label for="departamento">Departamento:</label>
          <input type="text" id="departamento" name="departamento" required>
        </div>
        <div class="form-group full-width">
          <label for="senha">Senha:</label>
          <input type="password" id="senha" name="senha" required>
        </div>
        <div class="form-group full-width">
          <label for="confirmarSenha">Confirmar Senha:</label>
          <input type="password" id="confirmarSenha" name="confirmarSenha" required>
        </div>
      `;
    } else if (tipoUsuario === "administrador") {
      camposAdicionaisDiv.innerHTML =
        camposComuns +
        `
        <div class="form-group full-width">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group full-width">
          <label for="registro">Registro:</label>
          <input type="text" id="registro" name="registro" required>
        </div>
        <div class="form-group full-width">
          <label for="cargo">Cargo:</label>
          <input type="text" id="cargo" name="cargo" required>
        </div>
        <div class="form-group full-width">
          <label for="departamento">Departamento:</label>
          <input type="text" id="departamento" name="departamento" required>
        </div>
        <div class="form-group full-width">
          <label for="senha">Senha:</label>
          <input type="password" id="senha" name="senha" required>
        </div>
                <div class="form-group full-width">
          <label for="confirmarSenha">Confirmar Senha:</label>
          <input type="password" id="confirmarSenha" name="confirmarSenha" required>
        </div>
      `;
    } else if (tipoUsuario === "cidadão") {
      camposAdicionaisDiv.innerHTML =
        camposComuns +
        `
        <div class="form-group full-width">
          <label for="cep">CEP:</label>
          <input type="text" id="cep" name="cep" required>
        </div>
        <div class="form-group full-width">
          <label for="logradouro">Logradouro:</label>
          <input type="text" id="logradouro" name="logradouro" required>
        </div>
        <div class="form-group full-width">
          <label for="bairro">Bairro:</label>
          <input type="text" id="bairro" name="bairro" required>
        </div>
        <div class="form-group full-width">
          <label for="localidade">Localidade:</label>
          <input type="text" id="localidade" name="localidade" required>
        </div>
        <div class="form-group full-width">
          <label for="uf">UF:</label>
          <input type="text" id="uf" name="uf" required>
        </div>
        <div class="form-group full-width">
          <label for="numero">Número:</label>
          <input type="text" id="numero" name="numero" required>
        </div>
        <div class="form-group full-width">
          <label for="complemento">Complemento:</label>
          <input type="text" id="complemento" name="complemento">
        </div>
        <div class="form-group full-width">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group full-width">
          <label for="senha">Senha:</label>
          <input type="password" id="senha" name="senha" required>
        </div>
        <div class="form-group full-width">
          <label for="confirmarSenha">Confirmar Senha:</label>
          <input type="password" id="confirmarSenha" name="confirmarSenha" required>
        </div>
      `;
    }
  }

  // Coleta os valores dos campos adicionais com base no tipo de usuário
  function coletarCamposAdicionais(tipoUsuario) {
    const camposAdicionais = {};

    if (tipoUsuario === "estudante") {
      camposAdicionais.matricula = document.getElementById("matricula").value;
      camposAdicionais.curso = document.getElementById("curso").value;
      camposAdicionais.polo = document.getElementById("polo").value;
    } else if (tipoUsuario === "professor") {
      camposAdicionais.registro = document.getElementById("registro").value;
      camposAdicionais.departamento =
        document.getElementById("departamento").value;
    } else if (tipoUsuario === "administrador") {
      camposAdicionais.registro = document.getElementById("registro").value;
      camposAdicionais.cargo = document.getElementById("cargo").value;
      camposAdicionais.departamento =
        document.getElementById("departamento").value;
    } else if (tipoUsuario === "cidadão") {
      camposAdicionais.cep = document.getElementById("cep").value;
      camposAdicionais.logradouro = document.getElementById("logradouro").value;
      camposAdicionais.bairro = document.getElementById("bairro").value;
      camposAdicionais.localidade = document.getElementById("localidade").value;
      camposAdicionais.uf = document.getElementById("uf").value;
      camposAdicionais.numero = document.getElementById("numero").value;
      camposAdicionais.complemento =
        document.getElementById("complemento").value;
    }

    return camposAdicionais;
  }
});
