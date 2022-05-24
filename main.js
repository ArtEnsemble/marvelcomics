//variables

const pubkey = "99857d20aeaf54e5c91156e7299517a1";
const privKey = "6a96a6bddcb289d14b320def623fd2013d97f89a";

const baseURL = "http://gateway.marvel.com/v1/public/";

const demoURL = "https://gateway.marvel.com:443/v1/public/comics?apikey=";

const output = document.getElementById("output");
const spotlight = document.getElementById("spotlight");
const closeSpotlight = document.querySelector("#spotlight #close");
const paginateControls = document.querySelector("#page-controls");

let mainData = [];

console.log(`${demoURL}${pubkey}`);

//FORM DATA
let nextResults = "";

let title = document.querySelector("#title");
let issue = document.querySelector("#issueNumber");

const submit = document.getElementById("search");
const nextButton = document.getElementById("next");

//events
window.addEventListener("load", randomIssue);
closeSpotlight.addEventListener("click", (e) => {
  spotlight.classList.remove("show");
});

document.addEventListener("click", function (e) {
  if (e.target.className === "creator__name") {
    console.log(`look up this creator `);
  }
  if (e.target.closest(".issue")) {
    spotlightIssue(e.target.closest(".issue").dataset.id);
  }
});

submit.addEventListener("click", function (e) {
  e.preventDefault();
  let controlForm = document.getElementById("control");
  let formData = new FormData(controlForm);
  formData.forEach((field) => console.log(field));

  setQuery();

  // getData(query);
});

nextButton.addEventListener("click", function (e) {
  e.preventDefault();
  getData(nextResults);
});

// queries

function setQuery() {
  let queryTitle, queryYear, queryCreator, queryIssue;

  if (title.value) {
    queryTitle = `&title=${title.value}`;
  }
  if (issue.value) {
    queryIssue = `&issueNumber=${issue.value}`;
  }

  let orderBy = "&orderBy=onsaleDate";
  const query = `&noVariants=true&${queryTitle ? queryTitle : ""}${orderBy}${
    queryIssue ? queryIssue : ""
  }&limit=25`;
  getData(query);
}

//get data

function getData(query) {
  const url = `${demoURL}${pubkey}${query}`;
  console.log(url);
  output.innerHTML = "";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.data);
      mainData = data.data.results;

      if (data.data.results.length === 1) {
        spotlightIssue(0);
        return;
      }

      displayData(data.data.results);
      if (data.data.total > 25) {
        console.log("lots of results");
        paginate(data.data, query);
      }
    })
    .catch((error) => console.log(`Error: ${error}`));
}

function paginate(data, query) {
  let pageTotal = data.count;
  let offset = data.offset;
  let totalResults = data.total;
  let limit = data.limit;
  paginateControls.style.visibility = "visible";
  if (pageTotal === totalResults) {
    return;
  } else {
    nextResults = `${query}&offset=${pageTotal}`;

    console.log("paginate this!");
  }
}

//show data

function displayData(data) {
  output.innerHTML = "";
  let frag = document.createDocumentFragment();

  data.forEach((data, index) => {
    let entry = document.createElement("div");
    entry.classList.add("issue");
    entry.setAttribute("data-id", index);
    entry.innerHTML = `<img src="${data.thumbnail.path}/portrait_xlarge.${data.thumbnail.extension}" alt="${data.title}"/><h2>${data.title}</h2>`;

    frag.appendChild(entry);
  });
  output.appendChild(frag);
}

// issue spotlight
function spotlightIssue(index) {
  document.querySelector("#spotlight h2").textContent = mainData[index].title;
  document.querySelector("#spotlight p").textContent =
    mainData[index].description;
  document.querySelector(
    "#spotlight img"
  ).src = `${mainData[index].thumbnail.path}/detail.${mainData[index].thumbnail.extension}`;
  document.querySelector("#spotlight img").alt = mainData[index].title;
  document.querySelector("#spotlight .creators").innerHTML = mainData[
    index
  ].creators.items
    .map(
      (item) =>
        `<li ><span class="creator__role">${item.role}</span>: <span class="creator__name" data-uri='${item.resourceURI}'>${item.name}</span></li>`
    )
    .join("");
  spotlight.classList.add("show");
}

//pick a number
function randomIssue() {
  let issue = Math.floor(Math.random() * 500);
  console.log(issue);
  getData(`&issueNumber=${issue}`);
}
