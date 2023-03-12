const containsArticle = document.querySelector('article') !== null;
let article;

console.log('Loaded Comments.js');

loadComments();

async function loadComments() {
    if (containsArticle) {
        addCss();

        const commentList = document.querySelector(".comments");

        if (commentList != null) {
            commentList.remove();
        }

        article = document.querySelector('article');

        const pane = document.querySelector('div.article-inner');

        const comments = chrome.runtime.getURL('Comments/Comments.html');

        if (pane !=  null) {
            const commentsContainer = document.createElement('div');

            commentsContainer.innerHTML = await (await fetch(comments)).text();
            pane.after(commentsContainer);

            let commentList = [];

            requestComments().then((data) => {
                data.forEach((comment) => {
                    commentList.push(comment);
                });

                commentList.sort((a, b) => {
                    return new Date(b.timePosted) - new Date(a.timePosted);
                });

                commentList.forEach((comment) => {
                    insertComments(comment);
                });
            });
        }
        //location.hash = "#custom-comments";
        registerPostButton();
    }
}

function insertComments(comment) {
    const commentTemplate = document.querySelector('#comment_template').content.firstElementChild.cloneNode(true);
    const comments = document.querySelector('.comments ul');

    const timePosted = comment.timePosted.split('T')[0] + ' ' + comment.timePosted.split('T')[1].substring(0, 5);
    commentTemplate.querySelector('.comment-text').textContent = comment.message;
    commentTemplate.querySelector('.comment-author-name b').textContent = comment.user.username;
    commentTemplate.querySelector('.comment-date').textContent = timePosted;

    comments.appendChild(commentTemplate);
}

function addCss() {
    const head = document.head;
    const link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL('Comments/Comments.css');

    head.appendChild(link);
}

async function requestComments() {
    const response = await fetch('https://roddelpraat-api.azurewebsites.net/GetAllCommentsFromArticle/' + article.id.split('-')[1]);
    return await response.json();
}

async function registerPostButton() {
    // Open roddelpraat.nl in new tab
    const postButton = document.querySelector('#post-comment');

    postButton.addEventListener('click', async () => {
        const comment = document.querySelector('#comment').value;

        if (comment.length === 0) {
            alert('Please enter a comment');
            return;
        }

        const articleId = article.id.split('-')[1];

        fetch('https://roddelpraat-api.azurewebsites.net/AddComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": 2,
                "message": comment,
                "articleId": articleId,
                "timePosted": new Date().toISOString(),
                "likeCount": 0,
                "dislikeCount": 0,
                "isCommentTo": null
            })
        }).then((res) => {
            if (res.status === 200) {
                loadComments();
            }
        });
    });
}
