document.querySelector('.login-submit').addEventListener("click", submitLogin);

function submitLogin(){
    chrome.storage.sync.set({
        token: "SuperSecretToken"
    }, function() {
        setTimeout(function() {
            window.location.replace(chrome.runtime.getURL('Popup.html'));
        } , 750);
    });
}
