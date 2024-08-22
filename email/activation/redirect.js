

// redirect.js

// Récupération des paramètres depuis le serveur
const email = "<%= email %>";
const pwd = "<%= pwd %>";
const codeOTP = "<%= codeOTP %>";

// Construction de l'URL de redirection
const redirectUrl = `http://localhost:3000/owner/owner-redirect?email=${encodeURIComponent(email)}&pwd=${encodeURIComponent(pwd)}&otp=${encodeURIComponent(codeOTP)}`;

// Fonction pour effectuer la redirection
function redirectToAccount() {
  window.location.href = redirectUrl;
}

// Ajout d'un écouteur d'événement sur le bouton
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('redirectBtn');
  if (btn) {
    btn.addEventListener('click', redirectToAccount);
  }
});