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
let timerInterval;

window.onload = function () {
    init();
};

function init() {
    addTaskToList(); // Initial task list
    sumTaskTime(); // Initial totalSecond, totalMinute, and remainSecond

    // Binding click event with add task button
    let addTaskBtn = document.querySelector('#add_task'); // Add task input group button
    addTaskBtn.addEventListener("click", function (event) {
        addTaskButtonClickEventHandler(event); // Add new task input group nodes into task body
    }, false)

    // Binding click event with start task button
    let startTaskInputBtn = document.querySelector('#start_task'); // Add task input group button
    startTaskInputBtn.addEventListener("click", function (event) {
        startTaskButtonClickEventHandler(event); // Add new task input group nodes into task body
    }, false)

    // Binding mouseup event with remove task button
    let li = document.querySelector("#task-body li:first-child"); // Task li elements
    if (li) {
        li.addEventListener('mouseup', function (e) {
            removeTaskButtonClickEventHandler(e, this);
        }, false)
    }
}

function addTaskToList() {
    /*
     * Add tasks info into task list[global]
     */
    let taskElem = document.querySelectorAll("#task-body li"); // Query all task li element

    // Add all task to global variable task list
    Array.from(taskElem).map(liElem => {
        // Return if task already exist
        if (tasksList.hasOwnProperty(liElem.id)){
            return;
        }
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
        tempRemainSecond += task.timer.totalSecondRemain;
    }

    totalMinute = tempMinutes;
    totalSecond = tempSeconds;
    remainSecond = tempRemainSecond;
}

function startTaskButtonClickEventHandler(event, elem) {
    startCountDown(); // Start the count down
}

function startCountDown() {
    // Return if no task exist
    let tasks = document.querySelectorAll("#task-body>li");
    if(!tasks.length){
        return;
    }

    // Return if first task has not specified minute input
    let minute = document.querySelector("#task-body>li:first-child input:nth-child(2).task-minute").value;
    if (minute === ""){
        return;
    }

    let timers = []; // Timers of each task

    // Add each timer of task to timers array
    for (const [taskID, task] of Object.entries(tasksList)) {
        timers.push(task.timer)
    }

    // Return if first timer is started
    if (timers[0].isStart) {
        return
    }

    // Render page with timer time each second
    timerInterval = setInterval(function () {
        // Stop count down if no timer exist
        if (!timers.length) {
            clearInterval(timerInterval);
        }

        // Return if no timer exist
        if (!timers.length) {
            return
        }

        timers[0].start() // Start the first timer
        sumTaskTime(); // Update the total time of all task

        // Second left in a minute
        let second = (timers[0].secondRemain).toString().length < 2 ? ("0" + (timers[0].secondRemain % 60)).slice(-2) : (timers[0].secondRemain % 60);
        // Minute left
        let minute = timers[0].minuteRemain.toString().length < 2 ? ("0" + timers[0].minuteRemain).slice(-2) : timers[0].minuteRemain;

        console.log(`${minute}:${second}`)
        document.querySelector("#remain-time").textContent = minute + ":" + second // Render page timer

        // Remove timer and task if task's remain time is zero
        if (timers[0].totalSecondRemain === 0) {
            timers.shift(); // Remove the first timer in timers array
            document.querySelector("#task-body>li:first-child").remove(); // Remove task il element
        }
    }, 1000)
}

function addTaskButtonClickEventHandler(event) {
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
        '<input type="number" name="minute" class="form-control shadow-sm mr-1 task-minute" min="0" step="1" placeholder="Minute" required>' +
        '<div class="input-group-append">' +
        '<a class="btn btn-secondary shadow-sm task-remove-btn">Remove</a>' +
        '</div>' +
        '</div>' +
        '</form>'; // Task title, time and add button bodies

    liElem.querySelector(".task-remove-btn").addEventListener('mouseup', function (e) {
        removeTaskButtonClickEventHandler(e, this);
    }, false); // Add event listener to the task remove button

    liElem.querySelector(".task-title").addEventListener('input', function (e) {
        modifyTaskTitleInputEventHandler(e, this);
    }, false); // Add event listener to the task title input

    liElem.querySelector(".task-minute").addEventListener('input', function (e) {
        modifyTaskMinuteInputEventHandler(e, this);
    }, false); // Add event listener to the task minute input

    let taskBody = document.querySelector("#task-body");
    taskBody.appendChild(liElem); // Add task input group node into task ul element
    addTaskToList(); // Add new task to task list[global]
}

function removeTaskButtonClickEventHandler(event, elem) {
    if (event.target.classList.contains("task-remove-btn")) {
        event.preventDefault(); // Stop event for further action
        taskID = elem.parentNode.parentNode.parentNode.parentNode.id // Task id
        elem.parentNode.parentNode.parentNode.parentNode.remove(); // Remove task node from html node
        let isStart = tasksList[taskID].timer.isStart; // Is count down started

        // Stop timer is timer is started
        if (isStart) {
            tasksList[taskID].timer.stop(); // Stop the timer
            clearInterval(timerInterval); // Stop the count down interval
            // Start the next timer if task is more than two
        }

        delete tasksList[taskID]; // Remove task from task list[global]
        sumTaskTime(); // Sum and update the current task time

        // Start the next timer if count down is started and task is not empty
        if (isStart && Object.keys(tasksList).length > 0) {
            startCountDown();
        }
    }
}

function modifyTaskTitleInputEventHandler(event, elem) {
    if (event.target.classList.contains("task-title")) {
        taskID = elem.parentNode.parentNode.parentNode.parentNode.id // Task id
        tasksList[taskID].title = elem.value;
    }
}

function modifyTaskMinuteInputEventHandler(event, elem) {
    if (event.target.classList.contains("task-minute")) {
        taskID = elem.parentNode.parentNode.parentNode.id // Task id
        tasksList[taskID].timer.minute = elem.value;
    }
}

// TODO Add pause function to pause button