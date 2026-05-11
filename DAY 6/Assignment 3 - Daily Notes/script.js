/* You are building a simple web page where users can write daily notes and save them in their browser without using a server. 
📌 Requirements 
A textarea for writing notes. 
A Save button (using onclick). 
A Clear button. 
Notes must: 
Be stored in localStorage 
Automatically load when the page refreshes 
Display stored note on page load. 
 
🛠️ Technical Constraints 
Must use: 
onclick inline event 
localStorage.setItem() 
localStorage.getItem() 
localStorage.removeItem() 
No backend/database. 
Pure HTML + JavaScript only. 
Data stored as key-value pair.
// note   learn diff between onclick and its addEvent listener both looks same can be confusing
*/

function saveNote(){
    let message = document.getElementById("message").value;
    console.log(message)

    if(message)
    localStorage.setItem("saveNote", message);

    document.getElementById("output").innerText = "Note saved succesfully";
    // console.log(message)    
}

function clearNote(){
        document.getElementById("message").value = "";
        localStorage.removeItem("saveNote");
        document.getElementById("output").innerText = "Note cleared succesfully";
}