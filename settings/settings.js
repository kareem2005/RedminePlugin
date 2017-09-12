function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        apiKey: document.querySelector("#apikey").value
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#apikey").value = result.apiKey || "";
    }

    function onError(error) {
        // noinspection JSAnnotator
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.local.get("apiKey");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);