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
var listLength = 0; // Current tasksList length
let totalSecond = 0; // Total second of tasks object inside taskList
let totalMinute = 0; // Total minute of tasks object inside taskList
let remainSecond = 0; // Total remain second of tasks object inside taskList
let isAutoStart = false;
let timerInterval; // Interval of count down
var theme = 'light'; // Website current theme

window.onload = function () {
    init(); // Init all button and task element
};



function init() {
    addTaskToList(); // Initial task list
    sumTaskTime(); // Initial totalSecond, totalMinute, and remainSecond
    updateProgressBar(); // Update progress bar

    // Init Bootstrap tooltip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    // Binding click event with auto start button
    let autoStartBtn = document.querySelector("#auto-start")
    autoStartBtn.addEventListener("click", autoStartButtonClickEventHandler, false)

    //Binding click event with help button
    let helpBtn = document.querySelector("#help_btn");
    let closeHelpBtn = document.querySelector("#close_help");
    let modal = document.querySelector("#help_box");

    helpBtn.onclick = function () { // When the user clicks the button, open the modal 
        modal.style.display = "block";
    }

    closeHelpBtn.onclick = function () { // When the user clicks the button, close the modal
        modal.style.display = "none";
    }

    window.onclick = function (event) { // When the user clicks anywhere outside of the modal, close it
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    //Binding click event with change-theme button
    let changeThemeBtn = document.querySelector('#change-theme');
    changeThemeBtn.addEventListener('click', function (event) {
        // console.log("Passing in theme " + theme);

        changeThemeButtonClickEventHandler(theme);
    })

    // Binding click event with add task button
    let addTaskBtn = document.querySelector('#add-task'); // Add task input group button
    addTaskBtn.addEventListener("click", function (event) {
        addTaskButtonClickEventHandler(event); // Add new task input group nodes into task body
    }, false)

    // Binding click event with start task button
    let startTaskInputBtn = document.querySelector('#start-task'); // Add task input group button
    startTaskInputBtn.addEventListener("click", function (event) {
        startTaskButtonClickEventHandler(event); // Add new task input group nodes into task body
    }, false)

    // Binding click event with pause task button
    let pauseBtn = document.querySelector("#pause-task")
    pauseBtn.addEventListener('click', pauseTaskButtonClickEventHandler, false);

    // Binding click event with import task button
    const inputElement = document.querySelector("#import-task");
    inputElement.addEventListener("click", importTaskButtonClickEventHandler, false);

    // Binding click event with export task button
    let exportBtn = document.querySelector("#export-task");
    exportBtn.addEventListener('click', exportTaskButtonClickEventHandler, false);

    // Binding mouseup event with remove task button
    let li = document.querySelector("#task-body li:first-child"); // Task li elements
    if (li) {
        li.addEventListener('mouseup', function (e) {
            removeTaskButtonClickEventHandler(e, this);
        }, false)
    }
}

function autoStartButtonClickEventHandler(event) {
    isAutoStart = !isAutoStart; // Modify auto start status
    // Init Bootstrap tooltip

    $("#auto-start").tooltip('hide'); // Hide the current tooltip

    // Modify auto start button text
    if (isAutoStart) {
        event.target.innerText = "Auto"
        event.target.dataset.originalTitle = "Automatically start the next timer after finishing the current timer."
    } else {
        event.target.innerText = "Manuel"
        event.target.dataset.originalTitle = "Clicking on start button to start the next timer."
    }
}

function changeThemeButtonClickEventHandler(theme) {
    let body = $('body');
    let displayTime = $('#remain-time');
    let headerText = $('h1');
    let themeBtn = $('#change-theme');
    let timerBody = $('#timer__container .card');
    let taskHeader = $('#task__container .card-header');
    let taskHeaderText = $('#task__container .card-header span');
    let taskFooter = $('#task__container .card-footer');
    let taskFooterHr = $('.card-footer hr');
    let progress = $('.progress');
    let helpBtn = $("#help_btn");


    if (theme === 'dark') { // Change theme to light 
        this.theme = 'light';
        body.removeClass('dark-background');
        displayTime.removeClass("dark-remain-time");

        headerText.removeClass("dark-header-text border-white");
        headerText.addClass("border-dark");

        themeBtn.removeClass("fa-sun-o btn-light");
        themeBtn.addClass("fa-moon-o btn-dark");

        helpBtn.removeClass("btn-light");
        helpBtn.addClass("btn-dark");

        timerBody.css("background-color", "#ffecc7");
        progress.removeClass("dark-progress");

        taskHeader.css("background-color", "#fafcc2");
        taskHeaderText.removeClass("text-light");
        taskHeaderText.addClass("text-dark");
        taskFooter.css("background-color", "#fafcc2");
        taskFooterHr.css("border-top", "1px solid black");


    } else if (theme === 'light') { // Change theme to dark
        this.theme = 'dark';
        body.addClass("dark-background");
        displayTime.addClass("dark-remain-time");

        headerText.removeClass("border-dark");
        headerText.addClass("dark-header-text border-white");

        themeBtn.removeClass("fa-moon-o btn-dark");
        themeBtn.addClass("fa-sun-o btn-light");

        helpBtn.removeClass("btn-dark");
        helpBtn.addClass("btn-light");

        timerBody.css("background-color", "#ececec");
        progress.addClass("dark-progress");

        taskHeader.css("background-color", "#053f5e");
        taskHeaderText.removeClass("text-dark");
        taskHeaderText.addClass("text-light");
        taskFooter.css("background-color", "#053f5e");
        taskFooterHr.css("border-top", "1px solid white");
    }
}

function importTaskButtonClickEventHandler() {
    let inputNode = document.createElement("input");
    inputNode.type = "file";
    inputNode.accept = "text/csv";
    inputNode.onchange = function () {
        // Init file content
        const file = this.files[0]; // First file

        // Return if no file
        if (file === undefined) {
            return
        }

        // Return if file is not acceptable
        const isAcceptFileType = file.type === "application/vnd.ms-excel"; // Check file type
        const isAcceptExtension = file.name.split('.').slice(-1)[0] === "csv"; // Check file extension
        if (!isAcceptFileType || !isAcceptExtension) {
            return;
        }

        // Read csv content and add task onto page
        const reader = new FileReader();
        reader.onload = function (e) {
            let tasks = [];
            e.target.result.split('\n').forEach(function (task) {
                let info = task.split(',');
                let title = info[0]; // Task title
                let minute = info[2]; // Task minute

                createTaskNode(title, minute); // Create task li node
                addTaskToList(); // Add new task to task list[global]
            });
        }
        reader.readAsText(file, "UTF-8");
    };
    inputNode.click(); // Fire click event to start import action
}

function exportTaskButtonClickEventHandler(event) {
    // Init csv content
    let taskContent = []; // task info content
    Object.entries(tasksList).forEach(function ([taskID, taskObj], index) {
        let title = taskObj.title
        let second = taskObj.timer.second
        let minute = taskObj.timer.minute

        taskContent.push(`${title}, ${second}, ${minute}`)
    }); // Append task info to array
    taskContent = taskContent.join("\n");

    // Download event
    let downloadNode = document.createElement('a');
    downloadNode.onclick = function () {
        let blob = new Blob([taskContent], {
            type: "text/csv"
        }); // Object transfer
        downloadNode.href = URL.createObjectURL(blob); // Create URL
        downloadNode.download = "task.csv" // File name
        downloadNode.hidden = true; // Hide the node
    }
    downloadNode.click(); // Fire download event
}

function startTaskButtonClickEventHandler(event, elem) {
    startCountDown(); // Start the count down
}

function pauseTaskButtonClickEventHandler() {
    // Stop task timer
    Object.entries(tasksList).forEach(function ([taskID, taskObj], index) {
        // Return if not first task's timer
        if (index !== 0) {
            return;
        }

        taskObj.timer.stop(); // Stop timer
    });

    clearInterval(timerInterval); // Clear count down interval
}

function addTaskButtonClickEventHandler(event) {
    /*
     * Handle the event when add button is pressed.
     * Major job is create a task li node, and update tasksList[global].
     */
    createTaskNode(); // Create task li node
    addTaskToList(); // Add new task to task list[global]
}

function removeTaskButtonClickEventHandler(event, elem) {
    if (event.target.classList.contains("task-remove-btn")) {
        event.preventDefault(); // Stop event for further action
        let taskID = elem.parentNode.parentNode.parentNode.parentNode.id // Task id
        elem.parentNode.parentNode.parentNode.parentNode.remove(); // Remove task node from html node
        document.querySelector("#remain-time").textContent = "00:00" // Render page timer
        let isStart = tasksList[taskID].timer.isStart; // Is this timer started count down
        document.querySelector("#progress-percentage").innerText = "0%"; // Update progress bar text
        document.querySelector("#progress-time").setAttribute("aria-valuenow", "0");
        document.querySelector("#progress-time").style.width = "0";

        // Stop started timer
        if (isStart) {
            tasksList[taskID].timer.stop(); // Stop the timer
            clearInterval(timerInterval); // Stop the count down interval
        }

        delete tasksList[taskID]; // Remove task from task list[global]

        listLength--; // Reduce tasksList length 
        if (listLength == 3) {
            $("#task-body").css("height", "17.2rem"); // Change task-body back to default height
        }

        // Start the next timer if count down is started, task is not empty and auto start is select
        if (isAutoStart && isStart && Object.keys(tasksList).length > 0) {
            startCountDown();
        }
    }
}

function modifyTaskTitleInputEventHandler(event, elem) {
    if (event.target.classList.contains("task-title")) {
        let taskID = elem.parentNode.parentNode.parentNode.parentNode.id; // Task id
        tasksList[taskID].title = elem.value;
    }
}

function modifyTaskMinuteInputEventHandler(event, elem) {
    if (event.target.classList.contains("task-minute")) {
        let taskID = elem.parentNode.parentNode.parentNode.id // Task id
        tasksList[taskID].timer.minute = elem.value;
    }
}

function startCountDown() {
    // Return if no task exist
    let tasks = document.querySelectorAll("#task-body>li");
    if (!tasks.length) {
        return;
    }

    // Return if first task has not specified minute input
    let minute = document.querySelector("#task-body>li:first-child input:nth-child(2).task-minute").value;
    if (minute === "") {
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
        countDownProcess(timers);
    }, 1000)
}

function countDownProcess(timers) {
    // Stop count down if no timer exist
    if (!timers.length) {
        clearInterval(timerInterval);
        return;
    }

    // Remove timer and task if task's remain time is zero
    if (timers[0].totalSecondRemain === 0) {
        // Second left in a minute
        let second = (timers[0].secondRemain).toString().length < 2 ? ("0" + (timers[0].secondRemain)).slice(-2) : (timers[0].secondRemain);
        // Minute left
        let minute = timers[0].minuteRemain.toString().length < 2 ? ("0" + timers[0].minuteRemain).slice(-2) : timers[0].minuteRemain;
        updateProgressBar(); // Update progress bar
        // Render page timer
        document.querySelector("#remain-time").textContent = minute + ":" + second
        timers.shift(); // Remove the first timer in timers array
        document.querySelector("#task-body>li:first-child").remove(); // Remove task il element
        // Remove the first task from tasksList[global]
        Object.entries(tasksList).forEach(function ([taskID, taskObj], index) {
            if (index !== 0) {
                return
            }
            delete tasksList[taskID] // Remove task
        })

        listLength--; // Reduce tasksList length
        if (listLength == 3) {
            $("#task-body").css("height", "17.2rem"); // Change task-body back to default height
        }

        // play sound
        let completeSound = document.querySelector("#mission-complete");
        completeSound.play();

        // Stop count down if auto start is not selected
        if (!isAutoStart) {
            clearInterval(timerInterval);
            return;
        }
    }

    timers[0].start() // Start the first timer
    sumTaskTime(); // Update the total time of all task
    updateProgressBar(); // Update progress bar

    // Second left in a minute
    let second = (timers[0].secondRemain).toString().length < 2 ? ("0" + (timers[0].secondRemain)).slice(-2) : (timers[0].secondRemain);
    // Minute left
    let minute = timers[0].minuteRemain.toString().length < 2 ? ("0" + timers[0].minuteRemain).slice(-2) : timers[0].minuteRemain;
    // Render page timer
    document.querySelector("#remain-time").textContent = minute + ":" + second
}

function addTaskToList() {
    /*
     * Add tasks info into task list[global]
     */
    let taskElem = document.querySelectorAll("#task-body li"); // Query all task li element

    // Add all task to global variable task list
    Array.from(taskElem).map(liElem => {
        // Return if task already exist
        if (tasksList.hasOwnProperty(liElem.id)) {
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

function updateProgressBar() {
    /*
     * Update the progress bar by current timer's time
     */

    // Fetch the percentage of the current timer's remain second
    let leftTimePercentage = 0;
    Object.entries(tasksList).forEach(function ([taskID, taskObj], index) {
        if (index !== 0) {
            return;
        }

        // Calculate the percentage of time left
        if (taskObj.timer.totalSecond !== 0) {
            leftTimePercentage = (taskObj.timer.totalSecondRemain / taskObj.timer.totalSecond * 100).toFixed(2);
        } else {
            leftTimePercentage = 0;
        }
    });

    // Update progress bar text
    document.querySelector("#progress-percentage").innerText = leftTimePercentage + "%";

    // Update progress bar width
    let progressBar = document.querySelector("#progress-time");
    progressBar.setAttribute("aria-valuenow", leftTimePercentage.toString());
    progressBar.style.width = leftTimePercentage + "%";
    progressBar.style.background = theme === 'light' ? "#0d7377" : "white";
}

function createTaskNode(title = "", minute = 0) {
    /*
     * Create new task input group node and
     * add the node as a child into the end of the task ul element.
     *
     * @param {string} newTaskID The ID of the new task
     */
    // Return is minute is not a number
    minute = parseInt(minute);
    if (isNaN(minute)) {
        return;
    }
    listLength++;
    // console.log("Task number: " + listLength);

    if (listLength == 4) {
        $("#task-body").css("height", "auto");
    }
    // Create li element for new task input group
    let lastTask = document.querySelector("#task-body li:last-child"); // Query the last task element
    let newTaskID = lastTask ? "task_" + (parseInt(lastTask.id.slice(-1)) + 1) : "task_1" // The ID for new task

    let liElem = document.createElement("li");
    liElem.className = "list-group-item";
    liElem.id = newTaskID;
    liElem.innerHTML = '<form>' +
        '<div class="input-group">' +
        '<div class="input-group-prepend mr-1">' +
        `<input type="text" name="title" class="form-control shadow-sm task-title" value="${title}" placeholder="Title" required>` +
        '</div>' +
        `<input type="number" name="minute" class="form-control shadow-sm mr-1 task-minute" value="${minute}" min="0" step="1" placeholder="Minute" required>` +
        '<div class="input-group-append">' +
        '<a class="btn btn-secondary shadow-sm task-remove-btn">Remove</a>' +
        '</div>' +
        '</div>' +
        '</form>'; // Task title, time and add button bodies

    // Add event listener to the task remove button
    liElem.querySelector(".task-remove-btn").addEventListener('mouseup', function (e) {
        removeTaskButtonClickEventHandler(e, this);
    }, false);

    // Add event listener to the task title input
    liElem.querySelector(".task-title").addEventListener('input', function (e) {
        modifyTaskTitleInputEventHandler(e, this);
    }, false);

    // Add event listener to the task minute input
    liElem.querySelector(".task-minute").addEventListener('input', function (e) {
        modifyTaskMinuteInputEventHandler(e, this);
    }, false);

    let taskBody = document.querySelector("#task-body");
    taskBody.appendChild(liElem); // Add task input group node into task ul element
}