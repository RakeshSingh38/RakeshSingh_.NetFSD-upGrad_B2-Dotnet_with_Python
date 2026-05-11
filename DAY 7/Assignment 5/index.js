/* 
Develop a task manager where tasks are saved and retrieved asynchronously. 
 
📌 Requirements 
- Store tasks in an array. 
- Create addTask(), deleteTask(), and listTasks() functions. 
- Simulate async storage using setTimeout with callbacks. 
- Convert callback-based logic into Promises. 
- Refactor into async/await version. 
- Use ES6 modules. 
 
🛠️ Technical Constraints 
- Must demonstrate callback → promise → async/await evolution. 
- Use let/const properly. 
- Use arrow functions. 
- Use template literals for display. 
 
🎯 Learning Outcome 
- Deep understanding of async JavaScript. 
- Learn refactoring async code. 
- Master modern ES6+ features.
*/

const tasks = ["task1", "task2", "task3"];

function addTasks(tasksArr, taskName) {
    return tasksArr.push(taskName);
}

function deleteTask(taskArr) {
    return taskArr.pop();
}

function listTasks(tasks){
    return tasks.map((t)=>{
        console.log(t);
    })
}

listTasks(tasks);