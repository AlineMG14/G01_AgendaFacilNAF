// Carregar o conteúdo do footer.html na div com id "footer"
fetch("components/footer/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  })
  .catch((error) => console.error("Erro ao carregar o footer:", error));
