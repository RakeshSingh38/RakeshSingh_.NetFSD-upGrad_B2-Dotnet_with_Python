/* 
Develop a task manager where tasks are saved and retrieved asynchronously. 
 
Requirements 
- Store tasks in an array. 
- Create addTask(), deleteTask(), and listTasks() functions. 
- Simulate async storage using setTimeout. 
- Use async/await for handling asynchronous operations. 
- Use ES6 modules. 
 
Technical Constraints 
- Use let/const properly. 
- Use arrow functions. 
- Use template literals for display. 
 
Learning Outcome 
- Deep understanding of async JavaScript. 
- Master modern ES6+ features.
*/

let tasks = ["task1", "task2", "task3"];

console.log("task manager");

const addTask = (taskName) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            tasks.push(taskName);
            resolve(`task "${taskName}" added successfully`);
        }, 1000);
    });
};

const deleteTask = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            tasks.pop();
            resolve(`task deleted successfully`);
        }, 1000);
    });
};

const listTasks = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const taskList = tasks
                .map((task, index) => `${index + 1}. ${task}`)
                .join('\n');
            resolve(`current tasks:\n${taskList}`);
        }, 500);
    });
};

const TaskManager = async () => {
    try {
        const listTask = await listTasks();
        console.log(listTask);
        
        const addNewTask = await addTask("task4");
        console.log(addNewTask+"\n");
        
        const list = await listTasks();
        console.log(list+"\n");
        
        const deleteT = await deleteTask();
        console.log(deleteT+"\n");
        
        const listT = await listTasks();
        console.log(listT+"\n");
    } catch (err) {
        console.log(err);
    }
};

TaskManager();


