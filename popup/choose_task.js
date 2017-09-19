var API = "ec80bfff50f3f6bf04249a1e0e9e9830fc2a3b27";
var DOMAIN = "rm.cit-sk.ru";
/*
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
*/
// ---------------------------------------------------------

document.addEventListener("click", function(e) {


  // Button "Go to Redmine"
  if (e.target.classList.contains("redmine_e"))
  {
      var chosenPage = "http://" + DOMAIN;
      browser.tabs.create({
          url: chosenPage
      });
  }

    // Button "Get actual tasks"
  if (e.target.classList.contains("tasks_e"))
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
              var subjectCell = "<td class='tasksubject_css taskdesc_e' id=" + i + " colspan=2>" + numTag + arr[i].subject + "</td>";
              var statusCell = "<td class='taskstatus_css percent_e' id=" + i + ">" + arr[i].status.name + "</td>";
              var readyCell = "<td class='ready_css ready_e' id=" + i + ">" + " Завершить задачу" + "</td>";
              document.getElementById("table").innerHTML += "<tr>" + subjectCell+ "</tr><tr>" + statusCell + readyCell + "</tr>";
          });

        document.addEventListener("click", function(e) {
            if (e.target.classList.contains("taskdesc_e"))
            {
                // TODO: task add comments functionality
                var taskId = e.target.id;
                var subjectCell = "<td class='tasksubject_css tasks_e' colspan=2>" + (+taskId + 1) + ". " + arr[taskId].subject + "</td>";
                var descriptionCell = "<td class='taskstatus_css comment_e' colspan=2 id=" + taskId + ">" + tasks.issues[taskId].description + "</td>";
                document.getElementById("table").innerHTML = "<tr>" + subjectCell+ "</tr><tr>" + descriptionCell + "</tr>";
            }
            if (e.target.classList.contains("ready_e"))
            {
                var taskId = e.target.id;
                var readyXhttp = new XMLHttpRequest();
                var jsonStatus = '{'
                    + '"issue": {'
                    + '"status_id": "5"'
                    + '}'
                    + '}';

                setIssueClosed(DOMAIN, API, tasks.issues[taskId].id, jsonStatus);

                function setIssueClosed (domain, api, id, data) {
                    readyXhttp.open("PUT", "http://" + domain + "/issues/" + id + ".json", false);
                    readyXhttp.setRequestHeader("Content-Type", "application/json");
                    readyXhttp.setRequestHeader("X-Redmine-API-Key", api);
                    readyXhttp.setRequestHeader("Access-Control-Allow-Origin", "1");
                    readyXhttp.send(data);
                }
                window.close();
            }
            if (e.target.classList.contains("percent_e"))
            {
                var taskId = e.target.id;
                var percentCell = "<td class='taskstatus_css taskback_e' id=" + taskId + ">" + arr[taskId].done_ratio + "%" + "</td>";
                e.target.outerHTML = percentCell;

            }
            if (e.target.classList.contains("taskback_e"))
            {
                var taskId = e.target.id;
                var statusCell = "<td class='taskstatus_css percent_e' id=" + taskId + ">" + arr[taskId].status.name + "</td>";
                e.target.outerHTML = statusCell;
            }
            // show comments
            if (e.target.classList.contains("comment_e"))
            {
                var taskId = e.target.id;
                var comXhttp = new XMLHttpRequest();

                getIssueComments(DOMAIN, API, tasks.issues[taskId].id);

                function getIssueComments (domain, api, id) {
                    comXhttp.open("GET", "http://" + domain + "/issues/" + id + ".json?include=journals", false);
                    comXhttp.setRequestHeader("Content-Type", "application/json");
                    comXhttp.setRequestHeader("X-Redmine-API-Key", api);
                    comXhttp.setRequestHeader("Access-Control-Allow-Origin", "1");
                    comXhttp.send();
                }

                var taskComments = JSON.parse(comXhttp.responseText);
                var subjectCell = "<td class='tasksubject_css tasks_e' colspan=2>" + (+taskId + 1) + ". " + arr[taskId].subject + "</td>";
                var descriptionCell = "<td class='taskstatus_css tasks_e' colspan=2>" + tasks.issues[taskId].description + "</td>";
                var commentCell = "";
                var commentForm = "<tr><td class='commentform_css' colspan=2><label class='commentarea_css'>Добавить комментарий: </label>\n"
                    +"<br>"
                    + "<textarea class='commentarea_css' id=\"commentButton\"></textarea>\n"
                    +"<br>"
                    +"<button type=\"submit\" class='commentadd_e' id=" + taskId + ">Save</button></td></tr>";

                var arrComments = taskComments.issue.journals;
                arrComments.forEach(function (item, i, arrComments) {
                    var numTag =  (i + 1) + ". ";
                    commentCell += "<tr><td class='taskuser_css tasks_e' id=" + taskId + ">" + arrComments[i].user.name + ":" +"</td></tr><tr><td class='taskcomment_css tasks_e' >" + numTag + arrComments[i].notes + "</td></tr>";
                });

                document.getElementById("table").innerHTML = "<tr>" + subjectCell+ "</tr><tr>" + descriptionCell + "</tr>" + commentCell + commentForm;

            }
            if (e.target.classList.contains("commentadd_e"))
            {
                var taskId = e.target.id;

                var comment = document.querySelector("#commentButton").value;
                var comXhttp = new XMLHttpRequest();
                var jsonObj = '{'
                    + '"issue": {'
                    + '"notes": "' + comment + '"'
                    + '}'
                    + '}';

                putIssueComments(DOMAIN, API, tasks.issues[taskId].id, jsonObj);

                function putIssueComments(domain, api, id, data) {
                    comXhttp.open("PUT", "http://" + domain + "/issues/" + id + ".json", false);
                    comXhttp.setRequestHeader("Content-Type", "application/json");
                    comXhttp.setRequestHeader("X-Redmine-API-Key", api);
                    comXhttp.setRequestHeader("Access-Control-Allow-Origin", "1");
                    comXhttp.send(data);
                }
                window.close();
            }
        });

      }
    }

  // Button "Settings"
  if (e.target.classList.contains("settings_e"))
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

