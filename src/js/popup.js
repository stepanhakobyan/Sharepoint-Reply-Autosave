window.addEventListener("load", (_ev) => {
    localizeExtension();
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
    clearAll.addEventListener("click", (ev) => {
        for (let i = 1; i <= 5; i++) {
            window.localStorage.removeItem(`previousReviewText${i}`);
            window.localStorage.removeItem(`previousReviewTime${i}`);
            let timeSpan = document.getElementById(`t${i}`);
            timeSpan.textContent = browser.i18n.getMessage("popupReplyNotSaved");
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
});
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
//# sourceMappingURL=popup.js.map