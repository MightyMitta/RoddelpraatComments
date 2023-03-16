document.querySelector('.register-submit').addEventListener("click", registerUser);
document.querySelector('.back-button').addEventListener("click", navigateBack)
const errorMessage = document.querySelector('.error-message');

function navigateBack() {
    window.location.href = "../Popup.html";
}

async function registerUser() {
    errorMessage.textContent = '';
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const email = document.querySelector('#email').value;

    const data = {
        username: username,
        password: password,
        email: email
    }

    // request validation from server
    let response;

    try {
        response = await (await fetch('https://roddelpraat-api.azurewebsites.net/Register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'allow-control-allow-origin': '*'
            }
        })).json();

        if (response.ok) {
            alert("Verifieer uw account om in te loggen.")
            window.location.href = "../Popup.html";
        } else if (response.status ===   400){
            if (response.errors.Email[0]){
                errorMessage.textContent = "Voer een geldig e-mailadres in";
                return;
            }
            errorMessage.textContent = "Er is een fout opgetreden. Probeer het opnieuw of neem contact op met de ontwikkelaar in de Discord server.";

        }
    } catch (error) { }



}
