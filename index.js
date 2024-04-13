let extensionPrefix = adkcpkpghahmbopkjchobieckeoaoeem;
let payload = document.querySelectorAll("textarea")[0].value;
let filePath = document.querySelectorAll("input")[1].value;
let arbitraryFileContent = document.querySelectorAll("textarea")[1];
let status = document.querySelector("#status");

function sections() {
    return document.querySelectorAll('body>div');
}

function changeStatusMessage(message) {
    status.textContent = ([message] || [""]).join();
}

function checkIfValid() {
    return new Promise((resolve, reject) => {
        resolve(Boolean(document.querySelector("input").value.length > 0));
    });
}

async function performInspection() {
    let valid = await checkIfValid();
    if (!valid) return;
    payload = document.querySelector("textarea").value;
    extensionPrefix = document.querySelector("input").value;
    let msg = await chrome.runtime.sendMessage({ type: "start-inspect", prefix: extensionPrefix, payload: payload === '' ? undefined : payload });
    if (!msg) return changeStatusMessage("failed!");
    return changeStatusMessage(msg.status);
}

async function cancelInspection() {
    let msg = await chrome.runtime.sendMessage({ type: "cancel-inspect" });
    if (!msg) return changeStatusMessage("failed!");
    return changeStatusMessage("canceled");
}

sections().forEach(function (element) {
    element.style.display = 'none';
});
sections()[0].style.display = 'block';
var currentIndex = 0;
function switchToNextSlide(offset) {
    sections()[currentIndex].style.display = 'none';
    currentIndex = currentIndex + offset;
    if (currentIndex >= sections().length) {
        currentIndex = 0;
    }
    if (currentIndex < 0) {
        currentIndex = sections().length - 1;
    }
    var newIndex = currentIndex;

    sections()[newIndex].style.display = 'block';
    newIndex = currentIndex;

}

document.onkeydown = async function (ev) {
    if (ev.repeat) return;
    console.log()
    if (!([document.body, document].includes(ev.target))) {
        return false;
    }
    if (ev.key === 'ArrowLeft') {
        switchToNextSlide(-1)
    } else if (ev.key === 'ArrowRight') {
        switchToNextSlide(1);
    }
}

// Button click event handler
start.addEventListener("click", performInspection);
cancel.addEventListener("click", cancelInspection);

// Start auto-run immediately
performInspection();
