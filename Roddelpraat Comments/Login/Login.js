document.querySelector('.login-submit').addEventListener("click", login);
document.querySelector('.back-button').addEventListener("click", navigateBack)
const errorMessage = document.querySelector('.error-message');

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

    let response;
    try {
        response = await fetch('https://roddelpraat-api.azurewebsites.net/Login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'access-control-allow-origin': '*'
            }
        });
        if (response.ok) {
            response.json().then(data => {
                chrome.storage.local.set({ "token": data.token });
                window.location.replace(chrome.runtime.getURL('Popup.html'));
            });
        } else if (response.status === 401) {
            errorMessage.textContent = "Voer een geldig e-mailadres in";
        } else if (response.status === 400) {
            errorMessage.textContent = "Voer een geldig e-mailadres in";
        }
    } catch (error) {
    }
}
