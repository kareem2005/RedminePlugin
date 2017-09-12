
function beastNameToURL() {

}



document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("page-choice"))
  {
    return;
  }
  var chosenPage = "http://rm.cit-sk.ru";
  browser.tabs.create({
      url: chosenPage
  });
});

