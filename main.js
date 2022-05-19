//variables

const pubkey = "99857d20aeaf54e5c91156e7299517a1";
const privKey = "6a96a6bddcb289d14b320def623fd2013d97f89a";

const baseURL = "http://gateway.marvel.com/v1/public/";

const demoURL = "https://gateway.marvel.com:443/v1/public/comics?apikey=";

const output = document.getElementById("output");

console.log(`${demoURL}${pubkey}`);

//FORM DATA
let nextResults = "";

let title = document.querySelector("#title");
let issue = document.querySelector("#issueNumber");

const submit = document.getElementById("search");
const nextButton = document.getElementById("next");

//events
window.addEventListener("load", randomIssue);

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
  const query = `${queryTitle ? queryTitle : ""}${orderBy}${
    queryIssue ? queryIssue : ""
  }&noVariants=true&limit=50`;
  getData(query);
}

//get data

function getData(query) {
  const url = `${demoURL}${pubkey}${query}`;
  console.log(url);
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayData(data.data.results);
      paginate(data.data, query);
    })
    .catch((error) => console.log(`Error: ${error}`));
}

function paginate(data, query) {
  let pageTotal = data.count;
  let offset = data.offset;
  let totalResults = data.total;
  let limit = data.limit;

  if (pageTotal === totalResults) {
    return;
  } else {
    nextResults = `${query}&offset=${pageTotal}`;
  }
}

//show data

function displayData(data) {
  output.innerHTML = "";
  let frag = document.createDocumentFragment();

  data.forEach((data) => {
    let entry = document.createElement("div");
    entry.classList.add("issue");
    entry.innerHTML = `<a href="${data.thumbnail.path}/detail.${data.thumbnail.extension}" target="_blank"><img src="${data.thumbnail.path}/portrait_xlarge.${data.thumbnail.extension}" alt="${data.title}"/></a><h2>${data.title}</h2>`;

    frag.appendChild(entry);
  });
  output.appendChild(frag);
}

//pick a number
function randomIssue() {
  let issue = Math.floor(Math.random() * 500);
  console.log(issue);
  getData(`&issueNumber=${issue}`);
}
