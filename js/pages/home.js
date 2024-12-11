const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const carousel = document.getElementById("carousel");

const items = document.querySelectorAll(".carousel-item");
let currentIndex = 0;

// Função para ir para o próximo item
function moveToNext() {
  currentIndex = (currentIndex + 1) % items.length; // Incrementa o índice e volta para o começo se ultrapassar o total de itens
  updateCarouselPosition();
  console.log("Avançado para o próximo item, índice atual: ", currentIndex);
}

// Função para ir para o item anterior
function moveToPrev() {
  currentIndex = (currentIndex - 1 + items.length) % items.length; // Decrementa o índice e vai para o último item se for menor que 0
  updateCarouselPosition();
  console.log("Voltado para o item anterior, índice atual: ", currentIndex);
}

// Função para atualizar a posição do carrossel
function updateCarouselPosition() {
  const offset = -currentIndex * 100; // A posição do carrossel é ajustada com a largura de um item (100% do container)
  carousel.style.transform = `translateX(${offset}%)`;
}

// Função para reiniciar o intervalo do carrossel
function restartCarouselInterval() {
  clearInterval(carouselInterval); // Limpar o intervalo anterior
  carouselInterval = setInterval(moveToNext, 3000); // Reiniciar o intervalo com 3 segundos
  console.log("Intervalo reiniciado para avançar a cada 3 segundos.");
}

// Configura os eventos de clique nos botões
prevButton.addEventListener("click", function () {
  moveToPrev();
  restartCarouselInterval(); // Reiniciar o intervalo ao clicar
});
nextButton.addEventListener("click", function () {
  moveToNext();
  restartCarouselInterval(); // Reiniciar o intervalo ao clicar
});

// Inicia o carrossel automaticamente a cada 3 segundos
let carouselInterval = setInterval(moveToNext, 3000);
