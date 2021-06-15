window.addEventListener<"load">("load", (_ev) => {
    let save = document.getElementById("save0") as HTMLButtonElement;
    save.addEventListener<"click">("click", async (_ev) => {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true });
        if (tabs && tabs.length == 1) {
            try {
                let reviewText: string = await browser.tabs.sendMessage(tabs[0].id, { text: 'getReviewDetails' });
                if (reviewText) {
                    console.log(reviewText);
                    let now = new Date();
                    window.localStorage.setItem("previousReviewText0", reviewText);
                    window.localStorage.setItem("previousReviewTime0", now.toLocaleString("en-GB"));
                    let timeSpan = document.getElementById("t0") as HTMLSpanElement;
                    timeSpan.textContent = now.toLocaleString("en-GB");
                }
            } catch(err) {
                console.error(err);
                console.error(tabs[0].url);
                console.error("Could not save review details.");
            }
        } else {
            console.log("no tab");
        }
    });


    for (let i = 0; i <= 5; i++) {
        let reviewText = window.localStorage.getItem(`previousReviewText${i}`);
        let time = window.localStorage.getItem(`previousReviewTime${i}`);
        if (reviewText) {
            let timeSpan = document.getElementById(`t${i}`) as HTMLSpanElement;
            timeSpan.textContent = time;
        }

        let restore = document.getElementById(`restoreText${i}`) as HTMLButtonElement;
        restore.addEventListener<"click">("click", async (ev) => {
            let tabs = await browser.tabs.query({ currentWindow: true, active: true });
            if (tabs && tabs.length == 1) {
                try {
                    let reviewText = window.localStorage.getItem(`previousReviewText${i}`);
                    let succeed: boolean = await browser.tabs.sendMessage(tabs[0].id, { text: "restoreText", reviewText: reviewText });
                    if (succeed) {
                        console.log("review restored.");
                    } else {
                        console.log("review is not restored.");
                    }
                } catch(err) {
                    console.error(err);
                    console.error(tabs[0].url);
                    console.error("Could not restore text.");
                }
            } else {
                console.log("no tab");
            }
        });

        let preview = document.getElementById(`preview${i}`) as HTMLButtonElement;
        preview.addEventListener<"click">("click", (ev) => {
            let reviewText = window.localStorage.getItem(`previousReviewText${i}`);
            let previewBody = document.getElementById("previewBody") as HTMLDivElement;
            previewBody.innerHTML = reviewText;

            let previewDiv = document.getElementById("previewDiv") as HTMLDivElement;
            previewDiv.style.visibility = "visible";
        });
    }

    let clearAll = document.getElementById("clearAll") as HTMLButtonElement;
    clearAll.addEventListener<"click">("click", (ev) => {
        for (let i = 1; i <= 5; i++) {
            window.localStorage.removeItem(`previousReviewText${i}`);
            window.localStorage.removeItem(`previousReviewTime${i}`);
            let timeSpan = document.getElementById(`t${i}`) as HTMLSpanElement;
            timeSpan.textContent = "լրացված չէ";
        }
    });

    let closePreview = document.getElementById("closePreview") as HTMLButtonElement;
    closePreview.addEventListener<"click">("click", (ev) => {
        let previewDiv = document.getElementById("previewDiv") as HTMLDivElement;
        previewDiv.style.visibility = "collapse";
    });

    let previewRestore = document.getElementById("previewRestore") as HTMLButtonElement;
    previewRestore.addEventListener<"click">("click", async (ev) => {
        let tabs = await browser.tabs.query({ currentWindow: true, active: true });
        if (tabs && tabs.length == 1) {
            try {
                let previewBody = document.getElementById("previewBody") as HTMLDivElement;
                let succeed: boolean = await browser.tabs.sendMessage(tabs[0].id, { text: "restoreText", reviewText: previewBody.innerHTML });
                if (succeed) {
                    console.log("preview resored.");
                } else {
                    console.log("preview is not restored.");
                }
            } catch(err) {
                console.error(err);
                console.error(tabs[0].url);
                console.error("Could not restore text from preview.");
            }
        } else {
            console.log("no tab");
        }
    });
});
