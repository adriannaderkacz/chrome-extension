let myWishes = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myWishes"))
const tabBtn = document.getElementById("tab-btn")

if (leadsFromLocalStorage) {
    myWishes = leadsFromLocalStorage
    render(myWishes)
}

tabBtn.addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        myWishes.push({ type: "url", value: tabs[0].url })
        localStorage.setItem("myWishes", JSON.stringify(myWishes))
        render(myWishes)
    })
})

// Function to delete a single item
function deleteItem(index) {
    myWishes.splice(index, 1);
    localStorage.setItem("myWishes", JSON.stringify(myWishes));
    render(myWishes);
}

// Function to add a tag to an item
function addTag(index) {
    const tag = prompt("Enter a tag:");
    if (tag) {
        if (!myWishes[index].tags) {
            myWishes[index].tags = [];
        }
        myWishes[index].tags.push(tag);
        localStorage.setItem("myWishes", JSON.stringify(myWishes));
        render(myWishes);
    }
}

// Function to remove a tag from an item
function removeTag(leadIndex, tagIndex) {
    myWishes[leadIndex].tags.splice(tagIndex, 1);
    localStorage.setItem("myWishes", JSON.stringify(myWishes));
    render(myWishes);
}

// Event listener for delete icons on each item
ulEl.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-icon")) {
        const index = parseInt(event.target.dataset.index);
        deleteItem(index);
    } else if (event.target.classList.contains("plus-icon")) {
        const index = parseInt(event.target.dataset.index);
        addTag(index);
    } else if (event.target.classList.contains("remove-tag-icon")) {
        const leadIndex = parseInt(event.target.dataset.leadIndex);
        const tagIndex = parseInt(event.target.dataset.tagIndex);
        removeTag(leadIndex, tagIndex);
    }
});

// Modify the render function to include delete icons and plus icons for each item, and render tags
function render(leads) {
    let listItems = "";
    for (let i = 0; i < leads.length; i++) {
        const deleteIcon = `<i class="fa-regular fa-trash delete-icon" style="color: #90CAF9;" data-index="${i}"></i>`;
        const plusIcon = `<i class="fa-regular fa-circle-plus plus-icon" style="color: #90CAF9;" data-index="${i}"></i>`;
        let tags = "";
        if (leads[i].tags) {
            tags = leads[i].tags.map((tag, tagIndex) => `
                <span class="tag">
                    <i class="fa-solid fa-tag"></i>
                    ${tag}
                    <i class="fa-sharp fa-light fa-circle-xmark remove-tag-icon" data-lead-index="${i}" data-tag-index="${tagIndex}"></i>
                </span>
            `).join(" ");
        }
        if (leads[i].type === "url") {
            listItems += `
                <li>
                    <i class="fa-solid fa-star" style="color: #90caf9;"></i>
                    <a target='_blank' href='${leads[i].value}'>
                        ${leads[i].value}
                    </a>
                    ${tags}
                    ${plusIcon}
                    ${deleteIcon}
                </li>
            `;
        } else {
            listItems += `
                <li>
                    <i class="fa-solid fa-star" style="color: #90caf9;"></i>
                    ${leads[i].value}
                    ${tags}
                    ${plusIcon}
                    ${deleteIcon}
                </li>
            `;
        }
    }
    ulEl.innerHTML = listItems;
}

// Event listener for delete all button
deleteBtn.addEventListener("click", function() {
    localStorage.clear();
    myWishes = [];
    render(myWishes);
});

inputBtn.addEventListener("click", function() {
    myWishes.push({ type: "wish", value: inputEl.value });
    inputEl.value = "";
    localStorage.setItem("myWishes", JSON.stringify(myWishes));
    render(myWishes);
});
