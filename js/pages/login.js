document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const esqueceuSenhaLink = document.getElementById("esqueceuSenha");
  const esqueceuSenhaModal = document.getElementById("esqueceuSenhaModal");
  const closeModal = document.getElementsByClassName("close")[0];
  const esqueceuSenhaForm = document.getElementById("esqueceuSenhaForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Coleta os valores dos campos
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Recupera os usuários do localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se o usuário existe e a senha está correta
    const usuario = usuarios.find(
      (usuario) => usuario.email === email && usuario.senha === senha
    );

    if (usuario) {
      // Armazena o estado de login
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      alert("Login realizado com sucesso!");
      window.location.href = "index.html"; // Redirecionar para a página inicial após o login
    } else {
      alert("Email ou senha incorretos. Por favor, tente novamente.");
    }
  });

  // Abrir o modal "Esqueceu a senha?"
  esqueceuSenhaLink.addEventListener("click", function (event) {
    event.preventDefault();
    esqueceuSenhaModal.style.display = "block";
  });

  // Fechar o modal "Esqueceu a senha?"
  closeModal.addEventListener("click", function () {
    esqueceuSenhaModal.style.display = "none";
  });

  // Enviar email com senha ao usuário
  esqueceuSenhaForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailRecuperacao = document.getElementById("emailRecuperacao").value;
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(
      (usuario) => usuario.email === emailRecuperacao
    );

    if (usuario) {
      alert(`Um e-mail foi enviado para ${emailRecuperacao} com a sua senha.`);
      // Lógica para enviar o e-mail com a senha aqui (simulação)
    } else {
      alert("E-mail não encontrado. Por favor, tente novamente.");
    }

    esqueceuSenhaModal.style.display = "none";
  });

  // Fechar o modal clicando fora da caixa de conteúdo
  window.addEventListener("click", function (event) {
    if (event.target == esqueceuSenhaModal) {
      esqueceuSenhaModal.style.display = "none";
    }
  });
});
