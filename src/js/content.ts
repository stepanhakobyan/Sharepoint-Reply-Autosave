console.log("content.js is injected.");

// Listen for messages
browser.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    console.log(msg);
    // If the received message has the expected format...
    if (msg.text === "getReviewDetails") {
        
        return getReviewDetails();

    } else if (msg.text === "restoreText") {
        let reviewArea = findActiveReviewArea();
        if (reviewArea == null) {
            console.log("Active area not found.");
            return false;
        }
        
        console.info("Restored: " + msg.reviewText);
        reviewArea.innerHTML = msg.reviewText;
        return true;
    } else {
        console.error(msg.text);
    }
});

// 30 վայրկյանը մեկ կանչել AutoSave
const HALF_MINUTE: number = 30 * 1000;
setInterval(async (args) => {
    let reviewText = getReviewDetails();
    if (reviewText) {
        console.log("Saving: " + reviewText);
        await browser.runtime.sendMessage({ text: "Save", reviewText: reviewText });
    }
}, HALF_MINUTE);

function getReviewDetails(): string {
    let reviewArea = findActiveReviewArea();
    if (reviewArea != null && reviewArea.innerText != "" && reviewArea.innerText.length > 1 && reviewArea.innerText != "Add a reply") {
        // Դատարկը չհիշել։ Երբեմն գալիս է մեկ սիմվոլ 8203 (Zero Width Space), դա նույնպես չհիշել։ Չհիշել նաև նախնական լրացված «Add a reply»։
        return reviewArea.innerHTML;
    }
    return null;
}

//1. ms-rtestate-write ms-rteflags-2 ms-fullWidth ms-inputBox ms-textSmall ms-comm-postReplyTextBox ms-rtestate-field ms-inputBoxActive
//2. ms-rtestate-field ms-rtefield ms-inputBox ms-inputBoxActive
//  և ներդրված ms-rtestate-write ms-rteflags-0 ms-rtestate-field
function findActiveReviewArea(): HTMLDivElement {
    // let reviewArea = document.querySelector("div.ms-rtestate-write");
    let nodes = document.querySelectorAll("div.ms-rtestate-write");
    let reviewArea: Element = null;
    for (let n of nodes) {
        if (n.classList.contains("ms-inputBoxActive")) {
            reviewArea = n;
        }
    }
    if (!reviewArea && nodes.length > 0) {
        reviewArea = nodes[0];
    }
    return reviewArea as HTMLDivElement;
}

