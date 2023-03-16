const article = document.querySelector('article');
let message;
let token;

getVersion();

async function getVersion() {
    const localVersion = chrome.runtime.getManifest().version;
    const liveVersion = await fetch('https://raw.githubusercontent.com/MightyMitta/RoddelpraatComments/release/Roddelpraat%20Comments/manifest.json').then(response => response.json()).then(data => data.version);

    if (localVersion < liveVersion) {
        newUpdate(liveVersion);
    }
}

function newUpdate(version) {
    const updateNode = document.createElement('h1');
    updateNode.innerHTML = `<a target="_blank" href="https://github.com/MightyMitta/RoddelpraatComments/releases" style="color: white">[${version}] Roddelpraat Comments Update Beschikbaar!</a>`;
    updateNode.style.display = 'flex';
    updateNode.style.justifyContent = 'center';
    updateNode.style.alignItems = 'center';
    updateNode.style.height = '50px';
    updateNode.style.backgroundColor = 'red';
    updateNode.style.margin = '0';

    document.querySelector('.header').insertBefore(updateNode, document.querySelector('.header').firstChild);
}

loadComments();

async function loadComments() {
    if (article) {
        injectCss();

        const commentSection = document.querySelector(".comments");

        if (commentSection != null) {
            commentSection.remove();
        }

        const articleInner = document.querySelector('div.article-inner');

        const commentSectionCode = chrome.runtime.getURL('Comments/Comments.html');

        if (articleInner != null) {
            const commentsContainer = document.createElement('div');

            commentsContainer.innerHTML = await (await fetch(commentSectionCode)).text();
            articleInner.after(commentsContainer);
            registerPostButton();

            let commentList = [];

            message = document.querySelector('.notify-message');

            const data = await getCommentsFromArticle();

            if (data ===   undefined || data.length ===   0) {
                message.innerText = 'Er zijn nog geen comments geplaatst onder dit artikel.';
                return;
            }

            if (token ===   undefined) {
                token = await (await chrome.storage.local.get('token')).token;
            }

            let response;

            try {
                response = await fetch('https://roddelpraat-api.azurewebsites.net/Auth/GetUser', {
                    method: 'GET',
                    'allow-control-allow-origin': '*',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });


            } catch (error) {
            }

            if (response.status ===   401) {
                document.querySelector('#comment').disabled = 'true';
                document.querySelector('#post-comment').disabled = 'true';
                document.querySelector('#post-comment').style.cursor = 'not-allowed';
            }

            let user;
            if (response.status ===   200) {
                user = await response.json();
            } else {
                user = {
                    id: 0
                };
            }


            data.forEach((comment) => {
                commentList.push(comment);
            });

            commentList.sort((a, b) => {
                return new Date(b.timePosted) - new Date(a.timePosted);
            });

            commentList.forEach((comment) => {
                insertComment(comment, user.id);
            });

            const primary = await (await chrome.storage.local.get('primary_color')).primary_color;
            const secondary = await (await chrome.storage.local.get('secondary_color')).secondary_color;

            const comments = document.querySelectorAll('.comment');
            for (let i = 0; i < commentSectionCode.length; i++) {
                if (comments[i] === undefined) {
                    break;
                }

                if (i % 2 === 0) {
                    if (primary) {
                        comments[i].style.backgroundColor = primary;
                    }
                } else {
                    if (secondary) {
                        comments[i].style.backgroundColor = secondary;
                    }
                }
            }
        }
    }
}

function insertComment(comment, userId) {
    const commentTemplate = document.querySelector('#comment_template').content.firstElementChild.cloneNode(true);
    const comments = document.querySelector('.comments ul');

    const timePosted = comment.timePosted.split('T')[0] + ' ' + comment.timePosted.split('T')[1].substring(0, 5);
    commentTemplate.querySelector('.comment-text').textContent = comment.message;
    commentTemplate.querySelector('.comment-author-name b').textContent = comment.user.username;
    commentTemplate.querySelector('.comment-date').textContent = timePosted;
    commentTemplate.querySelector('.delete-comment').id = comment.id;
    commentTemplate.querySelector('.delete-comment').addEventListener('click', async () => {
        await fetch('https://roddelpraat-api.azurewebsites.net/DeleteComment/' + comment.id, {
            method: 'DELETE',
            'allow-control-allow-origin': '*',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        loadComments();
    });

    if (comment.user.id !== userId) {
        commentTemplate.querySelector('.delete-comment').remove();
    }
    comments.appendChild(commentTemplate);

}

function injectCss() {
    const head = document.head;
    const link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL('Comments/Comments.css');

    head.appendChild(link);
}

async function getCommentsFromArticle() {
    let response;
    try {
        response = await fetch('https://roddelpraat-api.azurewebsites.net/GetAllCommentsFromArticle/' + article.id.split('-')[1]);
        if (response.ok) {
            message.style.display = 'none';
        } else if (response.status === 404) {
            message.innerText = 'Er zijn nog geen comments geplaatst onder dit artikel.';
        } else {
            message.innerText = 'Er is iets mis gegaan met het ophalen van de comments. Probeer het later opnieuw.';
        }
    } catch (error) {
    }
    return await response.json();
}

async function registerPostButton() {
    const postButton = document.querySelector('#post-comment');

    postButton.addEventListener('click', async () => {
        if (token === undefined) {
            token = await (await chrome.storage.local.get('token')).token;
        }

        const comment = document.querySelector('#comment').value;

        const articleId = article.id.split('-')[1];

        const response = await fetch('https://roddelpraat-api.azurewebsites.net/CreateComment', {
            method: 'POST',
            'allow-control-allow-origin': '*',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                "message": comment,
                "articleId": articleId,
                "isCommentTo": null
            })
        });
        if (response.status === 200) {
            loadComments();
        }
    });
}

