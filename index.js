const inputBtn = document.getElementById("input-btn");
const deleteAllBtn = document.getElementById("deleteall-btn");
const inputEl = document.getElementById("input-el");
const list = document.getElementById("ul-el");
let myLinks = [];
const link = JSON.parse(localStorage.getItem("myLinks"));
const tabBtn = document.getElementById("tab");

if (link) {
  myLinks = link;
  render(myLinks);
}

tabBtn.addEventListener("click", e => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLinks.push(tabs[0].url);
    render(myLinks);
    localStorage.setItem("myLinks", JSON.stringify(myLinks));
  });
});

deleteAllBtn.addEventListener("click", e => {
  localStorage.clear();
  myLinks = [];
  render(myLinks);
});

inputBtn.addEventListener("click", e => {
  if (inputEl.value.trim() !== "") {
    myLinks.push(inputEl.value);
    render(myLinks);
    inputEl.value = "";
    localStorage.setItem("myLinks", JSON.stringify(myLinks));
  }
});

inputEl.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    inputBtn.click();
  }
});

function render(links) {
  let listItem = "";
  for (let i = 0; i < links.length; i++) {
    listItem += `
      <li class="links-list" data-index="${i}">
        <a href='${links[i]}' target='_blank'>${links[i]}</a>
        <div class="options">
          <span class='more'>...</span>
          <p class='delete'>Delete</p>
        </div>
      </li>    
    `;
  }
  list.innerHTML = listItem;
}

// Handle clicks for "more" (...) and "delete" buttons using .links-list
list.addEventListener("click", function (e) {
  const listItem = e.target.closest(".links-list");
  if (!listItem) return;

  // Toggle delete button display
  if (e.target.classList.contains("more")) {
    listItem.classList.toggle("show-delete");
  }

  // Delete item
  if (e.target.classList.contains("delete")) {
    const index = listItem.getAttribute("data-index");
    deleteLink(Number(index));
  }
});

// Hide delete popup when mouse leaves the <li>
list.addEventListener("mouseout", function (e) {
  const listItem = e.target.closest(".links-list");
  if (listItem && !listItem.contains(e.relatedTarget)) {
    listItem.classList.remove("show-delete");
  }
});

function deleteLink(index) {
  myLinks.splice(index, 1);
  localStorage.setItem("myLinks", JSON.stringify(myLinks));
  render(myLinks);
}