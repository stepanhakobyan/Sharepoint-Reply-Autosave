window.addEventListener("load", async (_ev) => {
    await localizeExtension();
    let save = document.getElementById("save0");
    save.addEventListener("click", async (_ev) => {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true });
        if (tabs && tabs.length == 1) {
            try {
                let reviewText = await browser.tabs.sendMessage(tabs[0].id, { text: 'getReviewDetails' });
                if (reviewText) {
                    console.log(reviewText);
                    let now = new Date();
                    window.localStorage.setItem("previousReviewText0", reviewText);
                    window.localStorage.setItem("previousReviewTime0", now.toLocaleString("en-GB"));
                    let timeSpan = document.getElementById("t0");
                    timeSpan.textContent = now.toLocaleString("en-GB");
                }
            }
            catch (err) {
                console.error(err);
                console.error(tabs[0].url);
                console.error("Could not save review details.");
            }
        }
        else {
            console.log("no tab");
        }
    });
    for (let i = 0; i <= 5; i++) {
        let reviewText = window.localStorage.getItem(`previousReviewText${i}`);
        let time = window.localStorage.getItem(`previousReviewTime${i}`);
        if (reviewText) {
            let timeSpan = document.getElementById(`t${i}`);
            timeSpan.textContent = time;
        }
        let restore = document.getElementById(`restoreText${i}`);
        restore.addEventListener("click", async (ev) => {
            let tabs = await browser.tabs.query({ currentWindow: true, active: true });
            if (tabs && tabs.length == 1) {
                try {
                    let reviewText = window.localStorage.getItem(`previousReviewText${i}`);
                    let succeed = await browser.tabs.sendMessage(tabs[0].id, { text: "restoreText", reviewText: reviewText });
                    if (succeed) {
                        console.log("review restored.");
                    }
                    else {
                        console.log("review is not restored.");
                    }
                }
                catch (err) {
                    console.error(err);
                    console.error(tabs[0].url);
                    console.error("Could not restore text.");
                }
            }
            else {
                console.log("no tab");
            }
        });
        let preview = document.getElementById(`preview${i}`);
        preview.addEventListener("click", (ev) => {
            let reviewText = window.localStorage.getItem(`previousReviewText${i}`);
            let previewBody = document.getElementById("previewBody");
            previewBody.innerHTML = reviewText;
            let previewDiv = document.getElementById("previewDiv");
            previewDiv.style.visibility = "visible";
        });
    }
    let clearAll = document.getElementById("clearAll");
    clearAll.addEventListener("click", async (ev) => {
        let messages = await getMessages();
        for (let i = 1; i <= 5; i++) {
            window.localStorage.removeItem(`previousReviewText${i}`);
            window.localStorage.removeItem(`previousReviewTime${i}`);
            let timeSpan = document.getElementById(`t${i}`);
            //timeSpan.textContent = browser.i18n.getMessage("popupReplyNotSaved");
            timeSpan.textContent = messages.popupReplyNotSaved.message;
        }
    });
    let closePreview = document.getElementById("closePreview");
    closePreview.addEventListener("click", (ev) => {
        let previewDiv = document.getElementById("previewDiv");
        previewDiv.style.visibility = "collapse";
    });
    let previewRestore = document.getElementById("previewRestore");
    previewRestore.addEventListener("click", async (ev) => {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true });
        if (tabs && tabs.length == 1) {
            try {
                let previewBody = document.getElementById("previewBody");
                let succeed = await browser.tabs.sendMessage(tabs[0].id, { text: "restoreText", reviewText: previewBody.innerHTML });
                if (succeed) {
                    console.log("preview resored.");
                }
                else {
                    console.log("preview is not restored.");
                }
            }
            catch (err) {
                console.error(err);
                console.error(tabs[0].url);
                console.error("Could not restore text from preview.");
            }
        }
        else {
            console.log("no tab");
        }
    });
    let userLang = document.getElementById("lang");
    let userSelectedLang = window.localStorage.getItem("userSelectedLang");
    if (userSelectedLang) {
        userLang.value = userSelectedLang.substring(0, 2);
    }
    userLang.addEventListener("change", async (ev) => {
        window.localStorage.setItem("userSelectedLang", userLang.value);
        await localizeExtension();
    });
});
/*
// i18n localization implementation
function localizeExtension() {
    for (let i = 0; i <= 5; i++) {
        document.getElementById(`t${i}`).textContent = browser.i18n.getMessage("popupReplyNotSaved");
        document.getElementById(`preview${i}`).textContent = browser.i18n.getMessage("popupViewReply");
        document.getElementById(`restoreText${i}`).textContent = browser.i18n.getMessage("popupInjectReply");
    }
    document.querySelector(".content > h4:nth-child(1)").textContent = browser.i18n.getMessage("popupManuallySavedReplyTitle");
    document.querySelector(".content > h4:nth-child(4)").textContent = browser.i18n.getMessage("popupAutoSavedRepliesTitle");
    document.getElementById("save0").textContent = browser.i18n.getMessage("popupManuallySave");
    document.getElementById("clearAll").textContent = browser.i18n.getMessage("popupClearAutoSavedReplies");
    document.getElementById("previewRestore").textContent = browser.i18n.getMessage("popupInjectReply");
}
*/
async function localizeExtension() {
    let messages = await getMessages();
    for (let i = 0; i <= 5; i++) {
        let timeSpan = document.getElementById(`t${i}`);
        if (Number.isNaN(Number.parseFloat(timeSpan.textContent.substring(0, 1)))) {
            timeSpan.textContent = messages.popupReplyNotSaved.message;
        }
        document.getElementById(`preview${i}`).textContent = messages.popupViewReply.message;
        document.getElementById(`restoreText${i}`).textContent = messages.popupInjectReply.message;
    }
    document.querySelector(".content > h4:nth-child(2)").textContent = messages.popupManuallySavedReplyTitle.message;
    document.querySelector(".content > h4:nth-child(5)").textContent = messages.popupAutoSavedRepliesTitle.message;
    document.getElementById("save0").textContent = messages.popupManuallySave.message;
    document.getElementById("clearAll").textContent = messages.popupClearAutoSavedReplies.message;
    document.getElementById("previewRestore").textContent = messages.popupInjectReply.message;
}
async function getMessages() {
    let lang2;
    let userSelectedLang = window.localStorage.getItem("userSelectedLang");
    if (userSelectedLang) {
        lang2 = userSelectedLang.substring(0, 2);
    }
    else {
        lang2 = "hy";
        //lang2 = navigator.language.substring(0, 2);
    }
    let response = await fetch(`_locales/${lang2}/messages.json`, { method: 'GET' });
    let json = response.json();
    return json;
}
//# sourceMappingURL=popup.js.map