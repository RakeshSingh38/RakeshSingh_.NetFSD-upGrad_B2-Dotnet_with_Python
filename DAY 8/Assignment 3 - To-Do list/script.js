let taskBtn = document.getElementById("task");
let taskName = document.getElementById("name");
let taskList = document.getElementById("taskList");

let list = [];

let deleteTask = document.getElementById("delete");
function addTask() {
    taskBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (taskName.value != "") {
            console.log(taskName.value);
            list.push(taskName.value);
            let li = document.createElement("li");
            li.innerText = taskName.value;
            taskList.appendChild(li);
            taskName.value = "";
        }
    });
}

function removeTasks() {
    deleteTask.addEventListener("click", () => {
        list.pop();

        console.log(taskList.lastElementChild);
        if (taskList.lastElementChild) {
            taskList.removeChild(taskList.lastElementChild);
        }
    });
}
console.log(list);
addTask();
removeTasks();
