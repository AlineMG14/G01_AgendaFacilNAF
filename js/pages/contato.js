document.addEventListener("DOMContentLoaded", function () {
  const contatoForm = document.getElementById("contatoForm");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");

  contatoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;

    const contato = {
      nome: nome,
      email: email,
      mensagem: mensagem,
      data: new Date().toLocaleString(),
    };

    // Salvar a mensagem no localStorage
    let contatos = JSON.parse(localStorage.getItem("contatos")) || [];
    contatos.push(contato);
    localStorage.setItem("contatos", JSON.stringify(contatos));

    // Exibir o modal de confirmação
    modal.style.display = "block";

    // Limpar o formulário
    contatoForm.reset();

    // Fechar o modal e redirecionar para a página inicial ao clicar no botão de fechar
    closeModal.onclick = function () {
      modal.style.display = "none";
      window.location.href = "index.html";
    };

    // Fechar o modal e redirecionar para a página inicial ao clicar fora dele
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
        window.location.href = "index.html";
      }
    };
  });
});
