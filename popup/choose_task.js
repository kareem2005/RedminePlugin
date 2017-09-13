
// Take domain from settings
function getRedmineDomain() {
        return browser.storage.local.get("rmDomain");
}

// Take api key from settings
function getApiKey() {
    return browser.storage.local.get("apiKey");
}

function onError(error) {
    console.log("Error: " + error);
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
      var url = "___";
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", "http://" + url + "/issues.xml?assigned_to_id=me", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.setRequestHeader("X-Redmine-API-Key", "___");
      xhttp.setRequestHeader("Access-Control-Allow-Origin", "1");
      xhttp.send();
      alert(xhttp.responseText);
    }

  // Button "Settings"
  if (e.target.classList.contains("settings"))
  {
      function onOpened() {
          console.log("Settings page opened");
      }

      function onError(error) {
          console.log("Error: " + error);
      }

      var openingSettings = browser.runtime.openOptionsPage();
      openingSettings.then(onOpened, onError);
      window.close();
  }

});

