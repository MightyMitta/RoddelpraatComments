document.querySelector('#submit-settings').addEventListener('click', saveOptions);
document.querySelector('#reset-settings').addEventListener('click', defaultSettings);
const status = document.querySelector('#status');


let prim_color = document.querySelector('#prim-color');

let sec_color = document.querySelector('#sec-color');

loadOptions();

function loadOptions() {
     chrome.storage.local.get('primary_color', function(result) {
         if (result.primary_color[0] !==   undefined) {
             prim_color.value = result.primary_color;
         }
     });
     chrome.storage.local.get('secondary_color', function(result) {
        if (result.secondary_color[0] !==   undefined) {
            sec_color.value = result.secondary_color;
        }
     });
}

function saveOptions() {
    console.log(prim_color.value);
    console.log(sec_color.value);
    chrome.storage.local.set({
        primary_color: prim_color.value,
        secondary_color: sec_color.value
    }, function() {
        status.textContent = 'Options saved';
        setTimeout(function() {
            window.location.replace(chrome.runtime.getURL('Popup.html'));
        } , 750);
    });
}

function defaultSettings() {
    prim_color.value = '#8119e3';
    sec_color.value = '#2f1290';
    chrome.storage.local.set({
        primary_color: '#8119e3',
        secondary_color: '#2f1290'
    });
    status.textContent = 'Options saved';
    setTimeout(function() {
        window.location.replace(chrome.runtime.getURL('Popup.html'));
    } , 750);
}

//document.addEventListener('DOMContentLoaded', restore_options);
