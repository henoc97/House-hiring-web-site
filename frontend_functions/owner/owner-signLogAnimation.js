

document.addEventListener("DOMContentLoaded", function() {
    const text = "Extase-Home, votre gestionnaire de logement...";
    const textContainer = document.getElementById("animated-text");
  
    let index = 0;
    let typingInterval;
  
    function typeWriter() {
      if (index < text.length) {
        textContainer.innerHTML = text.slice(0, index + 1); // Afficher seulement jusqu'à l'index actuel
        index++;
      } else {
        clearInterval(typingInterval); // Arrêter l'intervalle une fois le texte terminé
        setTimeout(resetAnimation, 2000); // Pause de 2 secondes avant de recommencer
      }
    }
  
    function resetAnimation() {
      index = 0;
      textContainer.innerHTML = '...'; // Effacer le texte
      setTimeout(() => {
        typingInterval = setInterval(typeWriter, 100); // Recommencer l'animation
      }, 1000); // Pause d'une seconde avant de redémarrer
    }
  
    typingInterval = setInterval(typeWriter, 100);
    
    const featureItems = document.querySelectorAll(".features ul li");
  
    featureItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('show');
      }, index * 500); // Délai entre chaque élément pour l'effet cascade
    });
  });
  

  