
// Take domain from settings
function getRedmineDomain() {
        return browser.storage.local.get("rmDomain");
}

// Take api key from settings
function getApiKey() {
    return browser.storage.local.get("apiKey");
}


document.addEventListener("click", function(e) {
    // Button "Go to Redmine"
  if (e.target.classList.contains("redmine"))
  {
      var gettingDomain = getRedmineDomain();

      function onGot(item) {
          var chosenPage = "http://" + item.rmDomain;
              browser.tabs.create({
              url: chosenPage
          });
      }

      function onError(error) {
          console.log(`Error: ${error}`);
      }

      gettingDomain.then(onGot, onError);
  }

  // Button "Settings"
  if (e.target.classList.contains("settings"))
  {
      function onOpened() {
          console.log(`Settings page opened`);
      }

      function onError(error) {
          console.log(`Error: ${error}`);
      }

      var openingSettings = browser.runtime.openOptionsPage();
      openingSettings.then(onOpened, onError);
  }

});

