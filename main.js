//variables

const pubkey = "99857d20aeaf54e5c91156e7299517a1";
const privKey = "6a96a6bddcb289d14b320def623fd2013d97f89a";

const baseURL = "http://gateway.marvel.com/v1/public/";

const demoURL = "https://gateway.marvel.com:443/v1/public/comics?apikey=";

const output = document.getElementById("output");
const spotlight = document.getElementById("spotlight");
const closeSpotlight = document.querySelector("#spotlight #close");
const paginateControls = document.querySelector("#page-controls");

let offset = 0;
let nextOffset = 0;
let prevOffset = 0;
let resultPages = 0;

let currentQuery = "";

let mainData = [];
let objData = [];
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
    getIssue(e.target.closest(".issue").dataset.id);
  }

  if (e.target.closest("#resultPages a")) {
    if (document.querySelector(".currentPage")) {
      document.querySelector(".currentPage").classList.remove("currentPage");
    }
    console.log(`${currentQuery}&offset=${e.target.dataset.offset}`);

    getData(
      `${baseURL}/comics?${currentQuery}&offset=${e.target.dataset.offset}`
    );
    e.target.classList.add("currentPage");
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
  offset += 25;
  getData(`${nextResults}&offset=${offset}`);
});

// queries

function setQuery() {
  let queryTitle, queryYear, queryCreator, queryIssue;

  if (title.value) {
    queryTitle = `&title=${title.value}`;
  }
  if (issue.value) {
    queryIssue = `&issueNumber=${issue.value}`;
    0;
  }

  let orderBy = "&orderBy=onsaleDate";
  const query = `&noVariants=true${queryTitle ? queryTitle : ""}${orderBy}${
    queryIssue ? queryIssue : ""
  }&limit=25`;
  currentQuery = query;
  getData(`${baseURL}/comics?${query}`);
}

//get data

function getData(query) {
  const url = `${query}&apikey=${pubkey}`;
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
      if (data.data.results.length == 0) {
        output.innerHTML = "<p>Sorry, no results</p>";
        document.getElementById("resultPages").innerHTML = "";
      } else {
        displayData(data.data.results);

        if (data.data.total > 25) {
          console.log("lots of results");
          paginate(data.data, query);
        }
      }
    })
    .catch((error) => console.log(`Error: ${error}`));
}

function getIssue(id) {
  fetch(`${baseURL}/comics/${id}?apikey=${pubkey}`)
    .then((response) => response.json())
    .then((issueDetails) => {
      // console.log(issueDetails.data.results[0]);
      let issue = createObject(issueDetails.data.results[0]);
      console.log(issue);
      displayIssue(issue);
    });
}

function getSeries(id) {}

function paginate(data, query) {
  document.getElementById("resultPages").innerHTML = "";

  // number of results
  let pageTotal = data.count;
  offset = data.offset + 25;
  let totalResults = data.total;

  //calculate number of result pages
  resultPages = Math.ceil(totalResults / 25);
  // create page links
  for (i = 0; i < resultPages; i++) {
    document
      .getElementById("resultPages")
      .insertAdjacentHTML(
        "beforeend",
        `<a data-offset=${i * 25} class='${
          i * 25 === offset - 25 ? "currentPage" : " "
        }'>${i + 1} </a>`
      );
  }

  //show page controls
  paginateControls.style.visibility = "visible";
  if (pageTotal === totalResults) {
    return;
  } else {
    nextResults = `${query}`;
  }
}

//show data

function displayData(data) {
  output.innerHTML = "";
  let frag = document.createDocumentFragment();

  data.forEach((data, index) => {
    let entry = document.createElement("div");
    entry.classList.add("issue");
    entry.setAttribute("data-id", data.id);
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

function displayIssue(issue) {
  document.querySelector("#spotlight h2").textContent = issue.title;
  document.querySelector("#spotlight p").textContent = issue.description;
  document.querySelector(
    "#spotlight img"
  ).src = `${issue.thumbnailPath}/detail.${issue.thumbNailExtension}`;
  document.querySelector("#spotlight img").alt = issue.title;
  if (issue.creators) {
    document.querySelector("#spotlight .creators").innerHTML =
      issue.creators.items
        .map(
          (item) =>
            `<li ><span class="creator__role">${item.role}</span>: <span class="creator__name" data-uri='${item.resourceURI}'>${item.name}</span></li>`
        )
        .join("");
  }
  spotlight.classList.add("show");
}

//next or previous issue

//pick a number
function randomIssue() {
  let issue = Math.floor(Math.random() * 500);
  console.log(issue);
  getData(
    `https://gateway.marvel.com:443/v1/public/comics?issueNumber=${issue}&orderBy=onsaleDate`
  );
}

class Issue {
  constructor(
    title,
    id,
    issueNumber,
    thumbnailPath,
    thumbNailExtension,
    creators,
    series,
    saleDate
  ) {
    this.title = title;
    this.id = id;
    this.issueNumber = issueNumber;
    this.thumbnailPath = thumbnailPath;
    this.thumbNailExtension = thumbNailExtension;
    this.creators = creators;
    this.series = series;
    this.saleDate = saleDate;
  }
  nextIssue() {
    return `${baseURL}comics?issueNumber=${this.issueNumber + 1}&series=${
      this.series
    }&apikey=${pubkey}`;
  }
}

class Query {
  constructor(title, year, issue) {
    (this.title = title), (this.issue = issue), (this.year = year);
  }
}

function createObject(item) {
  let obj = new Issue(
    item.title,
    item.id,
    item.issueNumber,
    item.thumbnail.path,
    item.thumbnail.extension,
    item.creators,
    item.series.resourceURI,
    item.dates[0].date
  );
  return obj;
}
