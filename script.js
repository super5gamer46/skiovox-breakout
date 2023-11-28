let payload = document.querySelector(".textarea").textContent;
const target = { targetId: "browser" };
function getAllTargets() {
  return new Promise(async (resolve, reject) => {
    await chrome.debugger.attach(target, "1.3");
    let { targetInfos: targets } = (await chrome.debugger.sendCommand(
      target,
      "Target.getTargets"
    )).filter((targ) => targ.targetInfo.url.startsWith("chrome-extension://") && targ.targetInfo.type === "service_worker");
    resolve(targets);
  });
}

async function onRequest(url) {
  payload = document.querySelector(".textarea").textContent;
   await chrome.runtime.sendMessage({ type: "start-inspect", prefix: url.substring(0, 5), payload: `${payload}` });
}
async function openWindow(url) {
  await chrome.debugger.detach(target);
  await chrome.debugger.attach(target, "1.3");
   await chrome.debugger.sendCommand(
      target,
      "Target.createTarget",
      {
        url: url,
      }
    );
}
async function start(url) {
  await onRequest(url);
  await openWindow("chrome-extension://" + url + "/_generated_background_page.html");
}
async function setUpButtons() {
  if (document.querySelector(".targets").children) {
    let elements = [...document.querySelector(".targets").children];
    for (let elem in elements) {
      elements[elem].remove();
    }
  }
  let targets = await getAllTargets();
  for (let target in targets) {
    let button = document.createElement("button");
    button.textContent = targets[target].url;
    button.onclick = async function () {
      await start(targets[target].url.split("chrome-extension://")[1].toString().split("/")[0]);
    };
    let id = document.createElement("h2");
    id.textContent =
      targets[target].url
        .split("chrome-extension://")[1]
        .toString()
        .split("/")[0] +
      " - " +
      targets[target].type;
    document.querySelector(".targets").appendChild(button);
    document.querySelector(".targets").appendChild(id);
  }
}
document.querySelector(".start").onclick = setUpButtons;
