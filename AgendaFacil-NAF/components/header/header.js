fetch("components/header/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;

    // Após o conteúdo ser carregado, adicionar o evento de clique ao ícone do hambúrguer
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");

    // Verifica se os elementos existem antes de adicionar o evento
    if (menuToggle && menu) {
      menuToggle.addEventListener("click", () => {
        menu.classList.toggle("show");
      });
    }

    // Lógica de gerenciamento de estado de login/logout
    const loginLink = document.getElementById("loginLink");
    const profileLink = document.getElementById("profileLink");
    const logoutLink = document.getElementById("logoutLink");
    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");
    const userType = document.getElementById("userType");

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuarioLogado) {
      loginLink.style.display = "none";
      profileLink.style.display = "block";
      logoutLink.style.display = "block";
      userInfo.style.display = "block";
      userName.textContent = `Olá, ${usuarioLogado.nomeCompleto}`;
      userType.textContent = ` (${usuarioLogado.tipoUsuario})`;

      if (usuarioLogado.tipoUsuario === "administrador") {
        const adminLink = document.createElement("li");
        adminLink.innerHTML = '<a href="admin.html">Admin</a>';
        menu.appendChild(adminLink);
      } else if (usuarioLogado.tipoUsuario === "estudante") {
        const estudanteLink = document.createElement("li");
        estudanteLink.innerHTML = '<a href="estudante.html">Estudante</a>';
        menu.appendChild(estudanteLink);
      } else if (usuarioLogado.tipoUsuario === "professor") {
        const professorLink = document.createElement("li");
        professorLink.innerHTML = '<a href="professor.html">Professor</a>';
        menu.appendChild(professorLink);
      }
    } else {
      loginLink.style.display = "block";
      profileLink.style.display = "none";
      logoutLink.style.display = "none";
      userInfo.style.display = "none";
    }

    function logout() {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "index.html";
    }

    // Adicionar o evento de clique para logout
    if (logoutLink) {
      logoutLink.addEventListener("click", logout);
    }
  })
  .catch((error) => console.error("Erro ao carregar o header:", error));
