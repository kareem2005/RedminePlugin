function saveOptions(e) {
    e.preventDefault();
    //Mozilla W3 browser extension code
    /*
    browser.storage.local.set({
    */
    chrome.storage.local.set({
        apiKey: document.querySelector("#apikey").value,
        rmDomain: document.querySelector("#domain").value
    });
    window.close();
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
    //Mozilla W3 browser extension code
    /*
    api = browser.storage.local.get("apiKey");
    api.then(setCurrentApi, onError);
    var domain = browser.storage.local.get("rmDomain");
    domain.then(setCurrentDomain, onError);
    */
    chrome.storage.local.get("apiKey", setCurrentApi);
    chrome.storage.local.get("rmDomain", setCurrentDomain);

}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

