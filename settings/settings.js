function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        apiKey: document.querySelector("#apikey").value,
        rmDomain: document.querySelector("#domain").value
    });
}

function restoreOptions() {

    function setCurrentApi(result) {
        document.querySelector("#apikey").value = result.apiKey || "";

    }

    function setCurrentDomain(result) {
    document.querySelector("#domain").value = result.rmDomain || "redmine.org";
    }

    function onError(error) {
        // noinspection JSAnnotator
        console.log(`Error: ${error}`);
    }

    api = browser.storage.local.get("apiKey");
    api.then(setCurrentApi, onError);
    var domain = browser.storage.local.get("rmDomain");
    domain.then(setCurrentDomain, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

