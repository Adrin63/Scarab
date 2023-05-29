function openLink(url, wait = 500) {
    setTimeout(function(){
        window.location.replace(url);
      }, wait);
}

function getParam(paramName) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName);
}

function downloadScarab(latest = false, onclicked = false)
{
  let linkBase = "https://github.com/TheMulhima/Scarab/releases/latest/download/"

  if (latest) {
    linkBase = "https://nightly.link/TheMulhima/Scarab/workflows/build/master/";
  }

  var uap = new UAParser();
  platform = uap.getResult().os.name;
  macOS = ['Mac OS'];
  windowsOS = ['Windows'];
  linuxOS = ['Linux'];
  let link = null;

  if (macOS.indexOf(platform) !== -1)          link = linkBase + "Scarab-MacOS.zip";
  else if (windowsOS.indexOf(platform) !== -1) link = linkBase + "Scarab-Windows.zip";
  else if (linuxOS.indexOf(platform) !== -1)   link = linkBase + "Scarab-Linux.zip"

  if (link !== null) {
    openLink(link, onclicked ? 0 : 500);
  }
  else {
    setTimeout(function() {
      if (confirm("The website could not automatically detect your platform, would you like to open the releases page? You can download Scarab+ from there.")) {
        window.location.replace("https://github.com/TheMulhima/Scarab/releases/latest")
      }
    }, 500);
  }
}

function addDataToHTML(data, header)
{
  let screenShotTitleRegex = /## Screenshot:.*/g
  let imageRegex = /!\[.*\]\(.*\)/g
  let releaseNotes = data.replace(screenShotTitleRegex, "").replace(imageRegex, "");

  let releaseNotesHeader = document.createElement("h2");
  releaseNotesHeader.innerHTML = header;
  releaseNotesHeader.className = "center centertext";
  releaseNotesHeader.setAttribute("style", "margin-top:40px");
  document.body.appendChild(releaseNotesHeader);

  let releaseNotesBody = document.createElement("zero-md");
  releaseNotesBody.className = "center";
  let md = window.markdownit();
  releaseNotesBody.innerHTML = md.render(releaseNotes);
  document.body.appendChild(releaseNotesBody);
}

function updateContentsOfLandingPage() {
  var download = getParam("download");

  if (download !== null) {
    downloadScarab(download === "latest");
    document.getElementById("download-message").innerHTML = "If nothing has be downloaded, please download it from the <a href=\"https://github.com/TheMulhima/Scarab/releases/latest\">releases page</a>";
    document.getElementById("noParam").remove();
    document.getElementById("header").innerHTML = "Thank you for downloading Scarab+";

    return new Promise((resolve, reject) => {
      if (download !== 'update') {
        fetch("https://raw.githubusercontent.com/TheMulhima/Scarab/master/README.md")
        .then(response => response.text())
        .then(data => {
          addDataToHTML(data.substring(752), "Readme: ");
          resolve();
        });
      } else {
        fetch("https://api.github.com/repos/TheMulhima/Scarab/releases/latest")
        .then(response => response.json())
        .then(data => {
          addDataToHTML(data.body, "Release Notes: ");
          resolve();
        })
      }
    });
  }
}