document.querySelector('.register-submit').addEventListener("click", registerUser);
document.querySelector('.back-button').addEventListener("click", navigateBack)

function navigateBack() {
    window.location.href = "../Popup.html";
}

async function registerUser() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const email = document.querySelector('#email').value;

    const data = {
        username: username,
        password: password,
        email: email
    }

    // request validation from server
    await fetch('https://roddelpraat-api.azurewebsites.net/Register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            alert("Verifieer uw account om in te loggen.")
            window.location.href = "../Popup.html";
        } else {
            // to be replaced with a text on the page
            alert("Er is iets misgegaan, probeer het opnieuw of neem contact op de ontwikkelaar.");
        }
    });
}
