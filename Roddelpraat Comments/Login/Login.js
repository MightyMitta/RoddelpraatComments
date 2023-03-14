document.querySelector('.login-submit').addEventListener("click", login);

async function login() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    const data = {
        username: username,
        password: password
    }

    // request validation from server
    await fetch('https://roddelpraat-api.azurewebsites.net/Login/', {
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
        } else {
            // to be replaced with a text on the page
            alert("Username or password is incorrect");
        }
    });
}
