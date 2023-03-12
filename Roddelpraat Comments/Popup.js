const tabs = await chrome.tabs.query({
  url: ['https://www.roddelpraat.nl/*']
});

// chrome.storage.sync.get(['token'], function(result) {
//     alert(result.token);
// });



loadTabs();
registerLoginButton();
registerSettingsButton();
registerHeaderButton();

function loadTabs() {
    const collator = new Intl.Collator();
    tabs.sort((a, b) => collator.compare(a.title, b.title));

    const template = document.getElementById('li_template');
    const elements = new Set();

    if (tabs.length === 0) {
        const element = template.content.firstElementChild.cloneNode(true);
        element.querySelector('.title').textContent = 'No tabs found';
        element.querySelector('.pathname').textContent = '';
        element.querySelector('.closetab').remove();
        elements.add(element);
    }

    for (const tab of tabs) {
        const element = template.content.firstElementChild.cloneNode(true);

        const title = tab.title;
        const pathname = tab.url.replace('https://', '');

        element.querySelector('.title').textContent = title;
        element.querySelector('.pathname').textContent = pathname;
        element.querySelector('.closetab').addEventListener('click', async () => {
            await chrome.tabs.remove(tab.id);
            element.remove();
        });

        element.querySelector('a').addEventListener('click', async (event) => {
            await chrome.tabs.update(tab.id, { active: true });
            await chrome.windows.update(tab.windowId, { focused: true });

            event.stopPropagation();
        });

        elements.add(element);
    }

    document.querySelector('ul').append(...elements);
}

function registerHeaderButton() {
    // Open roddelpraat.nl in new tab
    const headerButton = document.querySelector('.open-site');

    headerButton.addEventListener('click', async () => {
        const tab = await chrome.tabs.create({
            url: 'https://www.roddelpraat.nl/'
        });
        await chrome.windows.update(tab.windowId, { focused: true });
    });
}

async function registerLoginButton() {
    // Open roddelpraat.nl in new tab
    const loginButton = document.querySelector('.login-button');

    loginButton.addEventListener('click', async () => {
        window.location.replace(chrome.runtime.getURL('Login/Login.html'));
    });
}

async function registerSettingsButton() {
    // Open roddelpraat.nl in new tab
    const loginButton = document.querySelector('.settings-button');

    loginButton.addEventListener('click', async () => {
        window.location.replace(chrome.runtime.getURL('Settings/Settings.html'));
    });
}
