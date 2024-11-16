


// Function to check password validity
function validatePassword(pwd, pwd1, messageDiv) {
    // Get the message div element
    if (messageDiv) {
        // Check if passwords match
        if (pwd !== pwd1) {
            messageDiv.textContent = "Les mots de passe ne correspondent pas.";
            messageDiv.classList.remove('green-message');
            messageDiv.classList.add('red-message');
            return false;
        }
        
        // Check if the password length is at least 5 characters
        if (pwd.length < 5) {
            messageDiv.textContent = "Le mot de passe doit contenir au moins 5 caractères.";
            messageDiv.classList.remove('green-message');
            messageDiv.classList.add('red-message');
            return false;
        }
        
        // Check if the password contains repeating characters
        const repeatedCharPattern = /(.)\1{3,}/; // Checks for 4 or more repeating characters
        if (repeatedCharPattern.test(pwd)) {
            messageDiv.textContent = "Le mot de passe ne doit pas contenir 4 caractères identiques consécutifs.";
            messageDiv.classList.remove('green-message');
            messageDiv.classList.add('red-message');
            return false;
        }
        return true;    
    }
    return true;
}

  