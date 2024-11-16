

/**
 * @fileoverview This script adds typing animation to a text element and animates feature items
 * on the webpage when the DOM content is fully loaded.
 */

/**
 * Initializes the typing effect and feature item animations once the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function() {
  const text = "Extase-Home, votre gestionnaire de logement..."; // Text to be animated
  const textContainer = document.getElementById("animated-text"); // Container for animated text

  let index = 0; // Current index in the text
  let typingInterval; // Interval ID for typing effect

  /**
   * Types out the text character by character.
   * Updates the text container with the current slice of the text.
   * Once the text is fully typed, stops the interval and resets the animation.
   */
  function typeWriter() {
    if (index < text.length) {
      textContainer.innerHTML = text.slice(0, index + 1); // Display text up to the current index
      index++;
    } else {
      clearInterval(typingInterval); // Stop the interval when the text is fully typed
      setTimeout(resetAnimation, 2000); // Pause for 2 seconds before restarting the animation
    }
  }

  /**
   * Resets the typing animation by clearing the text and restarting the typing effect
   * after a short delay.
   */
  function resetAnimation() {
    index = 0; // Reset the index to start typing from the beginning
    textContainer.innerHTML = '...'; // Clear the text container
    setTimeout(() => {
      typingInterval = setInterval(typeWriter, 100); // Restart the typing animation
    }, 1000); // Pause for 1 second before restarting
  }

  // Start the typing effect
  typingInterval = setInterval(typeWriter, 100);
  
  // Animate feature items with a cascading effect
  const featureItems = document.querySelectorAll(".features ul li");

  featureItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('show'); // Add class to show each item
    }, index * 500); // Delay between each item for cascading effect
  });
});
