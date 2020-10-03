/*
 * Organization: UniSA
 * Subject Tool For Software Development
 * Group: Thu11_group02
 * Created Date: 26/09/2020
 */

/*
 * The controller of this timer web application.
 * This major function of this controller is to handle the loop of this application
 */
let tasksList = {}; // Contain all the task object
let totalSecond = 0; // Total second of tasks object inside taskList
let totalMinute = 0; // Total minute of tasks object inside taskList
let remainSecond = 0; // Total remain second of tasks object inside taskList

window.onload = function () {
    let addTaskInputBtn = document.querySelector('#add_task'); // Add task input group button

    addTaskInputBtn.addEventListener("click", function (event) {
        addTaskNode(event); // Add new task input group nodes into task body
    }, false)

    addTaskToList(); // Initial task list
    sumTaskTime(); // Initial totalSecond, totalMinute, and remainSecond

    let li = document.querySelector("#task-body li:first-child"); // Task li elements
    if (li) {
        // Add event listener to each of the task li elements
        li.addEventListener('mouseup', function (e) {
            removeTaskButtonEventHandler(e, this);
        }, false)
    }
};

function addTaskNode(event) {
    /*
     * Create new task input group node and
     * add the node as a child into the end of the task ul element.
     */
    let lastTask = document.querySelector("#task-body li:last-child"); // Query the last task element
    let newTaskID = lastTask ? "task_" + (parseInt(lastTask.id.slice(-1)) + 1) : "task_1"// The ID for new task

    // Create li element for new task input group
    let liElem = document.createElement("li");
    liElem.className = "list-group-item";
    liElem.id = newTaskID;
    liElem.innerHTML = '<form>' +
        '<div class="input-group">' +
        '<div class="input-group-prepend mr-1">' +
        '<input type="text" name="title" class="form-control shadow-sm task-title" placeholder="Title" required>' +
        '</div>' +
        '<input type="number" name="minute" class="form-control shadow-sm mr-1 task-minute" step="1" placeholder="Minute" required>' +
        '<div class="input-group-append">' +
        '<a class="btn btn-secondary shadow-sm task-remove-btn">Remove</a>' +
        '</div>' +
        '</div>' +
        '</form>'; // Task title, time and add button bodies

    liElem.querySelector(".task-remove-btn").addEventListener('mouseup', function (e) {
        removeTaskButtonEventHandler(e, this);
    }, false); // Add event listener to the task remove button

    liElem.querySelector(".task-title").addEventListener('input', function (e) {
        changeTaskTitleEventHandler(e, this);
    }, false); // Add event listener to the task title input

    liElem.querySelector(".task-minute").addEventListener('input', function (e) {
        changeTaskMinuteEventHandler(e, this);
    }, false); // Add event listener to the task minute input

    let taskBody = document.querySelector("#task-body");
    taskBody.appendChild(liElem); // Add task input group node into task ul element
    addTaskToList(); // Add new task to task list[global]
}

function addTaskToList() {
    /*
     * Add tasks info into task list[global]
     */
    let taskElem = document.querySelectorAll("#task-body li"); // Query all task li element

    // Add all task to global variable task list
    Array.from(taskElem).map(liElem => {
        let taskForm = liElem.querySelector("form"); // Form element of task
        let titleElem = taskForm.elements.namedItem("title"); // Title input element of task
        let minuteElem = taskForm.elements.namedItem("minute"); // Minute input element of task

        let title = titleElem.value // Task title
        let minute = Timer.cleanInteger(minuteElem.value) // Task minute
        tasksList[liElem.id] = new Task(title, 0, minute); // Add Task to task list
    });
}

function sumTaskTime() {
    /*
     * Calculate and update the total minute, second, and remain second of all task inside task list
     */
    let tempMinutes = 0;
    let tempSeconds = 0;
    let tempRemainSecond = 0;

    // Sum the total second, minute, and remain second of current tasks in task list[global]
    for (const [taskID, task] of Object.entries(tasksList)) {
        tempMinutes += task.timer.minute;
        tempSeconds += task.timer.second;
        tempRemainSecond += task.timer.secondRemain;
    }

    totalMinute = tempMinutes;
    totalSecond = tempSeconds;
    remainSecond = tempRemainSecond;
}

function removeTaskButtonEventHandler(event, elem) {
    if (event.target.classList.contains("task-remove-btn")) {
        event.preventDefault(); // Stop event for further action
        taskID = elem.parentNode.parentNode.parentNode.parentNode.id // Task id
        delete tasksList[taskID]; // Remove task from task list[global]
        elem.parentNode.parentNode.parentNode.parentNode.remove(); // Remove task node from html node
        sumTaskTime(); // Sum and update the current task time
    }
}

function changeTaskTitleEventHandler(event, elem) {
    if (event.target.classList.contains("task-title")) {
        taskID = elem.parentNode.parentNode.parentNode.parentNode.id // Task id
        tasksList[taskID].title = elem.value;
    }
}

function changeTaskMinuteEventHandler(event, elem) {
    if (event.target.classList.contains("task-minute")) {
        taskID = elem.parentNode.parentNode.parentNode.id // Task id
        tasksList[taskID].timer.minute = elem.value;
    }
}