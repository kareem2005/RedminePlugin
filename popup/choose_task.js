
var gettingApi = getApiKey();
var gettingDomain = getRedmineDomain();
var API = "";
var DOMAIN = "";


function onGotApi(item) {
    API = item.apiKey;
    }
gettingApi.then(onGotApi, onError);

function onGotDomain(item) {
    DOMAIN = item.rmDomain;
}
gettingDomain.then(onGotDomain, onError);

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

// ---------------------------------------------------------

document.addEventListener("click", function(e) {


  // Button "Go to Redmine"
  if (e.target.classList.contains("redmine"))
  {
      var chosenPage = "http://" + DOMAIN;
      browser.tabs.create({
          url: chosenPage
      });
  }

    // Button "Get actual tasks"
  if (e.target.classList.contains("tasks"))
    {
      var xhttp = new XMLHttpRequest();


      getRedmineIssues(DOMAIN, API);

      injectTasksToHTML();

      function getRedmineIssues (domain, api) {
        xhttp.open("GET", "http://" + domain + "/issues.json?assigned_to_id=me", false);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("X-Redmine-API-Key", api);
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "1");
        xhttp.send();

    }
      function injectTasksToHTML () {
          var tasks = JSON.parse(xhttp.responseText);
          document.getElementById("table").innerHTML = "";
          var arr = tasks.issues;
          arr.forEach(function (item, i, arr) {
              var numTag =  (i + 1) + ". ";
              var subjectCell = "<td class='tasksubject taskdesc' id=" + i + " colspan=2>" + numTag + arr[i].subject + "</td>";
              var statusCell = "<td class='taskstatus taskdesc' id=" + i + ">" + arr[i].status.name + "</td>";
              var readyCell = "<td class='rmtask ready' id=" + i + ">" + " Завершить задачу" + "</td>";
              document.getElementById("table").innerHTML += "<tr>" + subjectCell+ "</tr><tr>" + statusCell + readyCell + "</tr>";
          })

        document.addEventListener("click", function(e) {
            if (e.target.classList.contains("taskdesc"))
            {
                // TODO: task comments functionality
                var taskId = e.target.id;
                var subjectCell = "<td class='tasksubject tasks' colspan=2>" + (+taskId + 1) + ". " + arr[taskId].subject + "</td>";
                var description = "<td class='taskstatus tasks' colspan=2>" + tasks.issues[taskId].description + "</td>";
                document.getElementById("table").innerHTML = "<tr>" + subjectCell+ "</tr><tr>" + description + "</tr>";
            }
            if (e.target.classList.contains("ready"))
            {
                // TODO: task ready functionality
                alert("Типа выполнено");
            }
        });

        }
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

