import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase,
         ref,
         push,
         onValue,
         remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

const firebaseConfig = {
    databaseURL: process.env.DATABASE_URL
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDB = ref(database, "leads")

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const deleteBtn1 = document.getElementById("delete1-btn")
const themebtn = document.getElementById("theme-btn")
const body = document.body

let myLeads = []

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

onValue(referenceInDB, function(snapshot) {
    const snapshotDoesExist = snapshot.exists()
    if (snapshotDoesExist) {
        const snapshotValues = snapshot.val()
        myLeads = Object.values(snapshotValues)
        render(myLeads)
    } else {
        ulEl.innerHTML = ""
        myLeads = []
    }
})

// Theme toggle
themebtn.addEventListener("click", function() {
    body.classList.toggle("dark-theme")
    
    if (body.classList.contains("dark-theme")) {
        themebtn.textContent = "🌙"
    } else {
        themebtn.textContent = "☀️"
    }
})

// Delete all leads (double click)
deleteBtn.addEventListener("dblclick", function() {
    remove(referenceInDB)
})

// Delete last lead
deleteBtn1.addEventListener("click", function() {
    if (myLeads.length > 0) {
        // Remove the last item from local array
        const updatedLeads = myLeads.slice(0, -1)
        
        // Clear Firebase and re-populate with updated array
        remove(referenceInDB).then(() => {
            if (updatedLeads.length > 0) {
                updatedLeads.forEach(lead => {
                    push(referenceInDB, lead)
                })
            }
        })
    }
})

// Add new lead
inputBtn.addEventListener("click", function() {
    if (inputEl.value.trim() !== "") {
        push(referenceInDB, inputEl.value.trim())
        inputEl.value = ""
    }
})

// Add Enter key support for input
inputEl.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        inputBtn.click()
    }
})