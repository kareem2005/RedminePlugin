
// Take domain from settings
function getRedmineDomain() {
        return browser.storage.local.get("rmDomain");
}

// Take api key from settings
function getApiKey() {
    return browser.storage.local.get("apiKey");
}

function onError(error) {
    console.log(`Error: ${error}`);
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
      gettingDomain.then(onGot, onError);
      
  }

    // Button "Get actual tasks"
  if (e.target.classList.contains("tasks"))
    {

      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", "http://rm.cit-sk.ru/issues.json", false);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.setRequestHeader("X-Redmine-API-Key", "ec80bfff50f3f6bf04249a1e0e9e9830fc2a3b27");

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
      window.close();
  }

});

