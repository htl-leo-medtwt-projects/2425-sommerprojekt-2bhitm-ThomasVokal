// === LOGIN-FUNKTIONALITÄT START ===
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", function () {
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
  
        let valid = true;
  
        // Zurücksetzen des Rahmens
        usernameInput.style.border = "";
        passwordInput.style.border = "";
  
        // Validierung
        if (username === "") {
          usernameInput.style.border = "2px solid red";
          valid = false;
        }
  
        if (password === "") {
          passwordInput.style.border = "2px solid red";
          valid = false;
        }
  
        if (!valid) return;
  
        // Speichern im localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
  
        // Weiterleitung
        window.location.href = "project/autos.html";
      });
    }
  });
// === LOGIN-FUNKTIONALITÄT ENDE ===