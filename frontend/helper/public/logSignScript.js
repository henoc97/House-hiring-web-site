/**
 * @fileoverview This file handles the login and signup form interactions,
 * including switching between the login and signup views, and handling
 * password reset link clicks.
 */

/**
 * The element displaying the login text.
 * @constant {Element}
 */
const loginText = document.querySelector(".title-text .login");

/**
 * The login form element.
 * @constant {Element}
 */
const loginForm = document.querySelector("form.login");

/**
 * The label element for the login button.
 * @constant {Element}
 */
const loginBtn = document.querySelector("label.login");

/**
 * The label element for the signup button.
 * @constant {Element}
 */
const signupBtn = document.querySelector("label.signup");

/**
 * The link element for the signup action located within the form.
 * @constant {Element}
 */
const signupLink = document.querySelector("form .signup-link a");

/**
 * The link element for password recovery located within the form.
 * @constant {Element}
 */
const passLink = document.querySelector("form .pass-link a");

/**
 * Handles the click event on the signup button.
 * Switches the view to the signup form by adjusting the margin-left of
 * the login form and login text.
 */
signupBtn.onclick = () => {
  loginForm.style.marginLeft = "-50%";
  if (loginText) {
    loginText.style.marginLeft = "-50%";
  }
};

/**
 * Handles the click event on the login button.
 * Switches the view back to the login form by resetting the margin-left
 * of the login form and login text.
 */
loginBtn.onclick = () => {
  loginForm.style.marginLeft = "0%";
  if (loginText) {
    loginText.style.marginLeft = "0%";
  }
};

/**
 * Handles the click event on the signup link.
 * Simulates a click on the signup button to switch to the signup view,
 * and prevents the default link action.
 * @returns {boolean} false to prevent default link behavior.
 */
signupLink.onclick = () => {
  signupBtn.click();
  return false;
};

/**
 * Handles the click event on the password reset link.
 * Redirects the user to the password reset page.
 */
passLink.onclick = () => {
  window.location.href = ownerSendEmailURL;
};
