function save_options() {
    const username = document.querySelector('#username').value;
    chrome.storage.sync.set({
        username: username
    }, function() {
        const status = document.querySelector('#status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            window.location.replace(chrome.runtime.getURL('Popup.html'));
        } , 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({
    }, function(items) {
         document.querySelector('#username').value = items.username;
    });
}

//document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('.button').addEventListener('click', save_options);
