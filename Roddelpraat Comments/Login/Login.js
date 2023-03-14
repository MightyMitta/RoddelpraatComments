document.querySelector('.login-submit').addEventListener("click", login);
document.querySelector('.back-button').addEventListener("click", navigateBack)

function navigateBack() {
    window.location.href = "../Popup.html";
}
async function login() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    const data = {
        username: username,
        password: password
    }

    // request validation from server
    await fetch('https://roddelpraat-api.azurewebsites.net/Login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                chrome.storage.local.set({ "token": data.token });
                window.location.replace(chrome.runtime.getURL('Popup.html'));
            });
        } else if (response.status === 401) {
            alert("Verifieer uw e-mailadres om in te loggen");
        } else if (response.status === 400) {
            alert("Gebruikersnaam of wachtwoord is onjuist");
        }
    });
}
