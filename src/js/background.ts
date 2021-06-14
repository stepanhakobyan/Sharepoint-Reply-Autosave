// Listen for messages
browser.runtime.onMessage.addListener(async (msg: {text: string, reviewText: string}, sender, sendResponse) => {
    console.log(msg);
    // If the received message has the expected format...
    if (msg.text === "Save") {
        let reviewText: string = msg.reviewText;

        for (let i = 1; i <= 5; i++) {
            let prevText = window.localStorage.getItem(`previousReviewText${i}`);
            if (prevText == reviewText) {
                console.log("Same text detected.");
                return;
            }
        }

        for (let i = 4; i > 0; i--) {
            let prevText = window.localStorage.getItem(`previousReviewText${i}`);
            let prevTime = window.localStorage.getItem(`previousReviewTime${i}`);
            if (prevText) {
                window.localStorage.setItem(`previousReviewText${i + 1}`, prevText);
                window.localStorage.setItem(`previousReviewTime${i + 1}`, prevTime);
            }
        }
        let now = new Date();
        window.localStorage.setItem(`previousReviewText1`, reviewText);
        window.localStorage.setItem(`previousReviewTime1`, now.toLocaleString("en-GB"));
    } else {
        console.error(msg);
    }
    //return null;
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        //if (startsWith(tab.url, "https://server2016.armsoft.am/Lists/Review/Flat.aspx")) {
            console.log("tabId - changeInfo - tab");
            console.log(tabId);
            console.log(changeInfo);
            console.log(tab);

            try {
                let res4 = await browser.tabs.executeScript(tabId, {
                    file: "/js/browser-polyfill.js"
                });
                console.log("browser-polyfill.js is injected");
                console.log(res4);

                let res3 = await browser.tabs.executeScript(tabId, {
                    file: "/js/content.js"
                });
                console.log("content.js is injected.");
                console.log(res3);
            } catch (err) {
                console.error(err);
                console.error("Error occured while injecting scripts.");
            }
        //}
    }
});

function startsWith(source: string, start: string): boolean {
    return source.lastIndexOf(start, 0) === 0;
}
