let myWishes = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myWishes") )
const tabBtn = document.getElementById("tab-btn")

if (leadsFromLocalStorage) {
    myWishes = leadsFromLocalStorage
    render(myWishes)
}

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myWishes.push({ type: "url", value: tabs[0].url })
        localStorage.setItem("myWishes", JSON.stringify(myWishes) )
        render(myWishes)
    })
})

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        if (leads[i].type === "url") {
            listItems += `
                <li>
                    ♡ 
                    <a target='_blank' href='${leads[i].value}'>
                        ${leads[i].value}
                    </a>
                </li>
            `
        } else {
            listItems += `<li>♡ ${leads[i].value}</li>`
        }
    }
    ulEl.innerHTML = listItems
}

deleteBtn.addEventListener("click", function() {
    localStorage.clear()
    myWishes = []
    render(myWishes)
})

inputBtn.addEventListener("click", function() {
    myWishes.push({ type: "wish", value: inputEl.value })
    inputEl.value = ""
    localStorage.setItem("myWishes", JSON.stringify(myWishes) )
    render(myWishes)
})