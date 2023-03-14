document.querySelector('.register-submit').addEventListener("click", registerUser);

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
    await fetch('https://roddelpraat-api.azurewebsites.net/Register/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                chrome.storage.local.set({ "token": data.token });
                window.location.href = "Popup.html";
            });
        } else {
            // to be replaced with a text on the page
            alert("Username or password is incorrect");
        }
    });
}
