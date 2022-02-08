window.onload = function () {

	if (localStorage["tasks"] !== undefined) {
		displayJSONtasks();
		document.getElementById("loadTasksDiv").style.display = 'none';
	}


}

async function addTask() {

	console.log("addtask")
	var taskNumber = 0;
	try {
		if (localStorage["tasks"] !== undefined) {
			taskNumber = await JSON.parse(localStorage["tasks"]).at(-1)["id"];
		}
	} catch (TypeError) {
		console.log("Type error");
		taskNumber = -1;
	}

	// TODO refactor error -> if empty, task number = 0

	title = document.getElementById("Task_title").value;
	init_date = document.getElementById("Task_init_date").value;
	end_date = document.getElementById("Task_end_date").value;
	tags = document.getElementById("Task_tags").value;
	description = document.getElementById("Task_description").value;

	new_task = {
		"id": taskNumber + 1,
		"title": title,
		"init_date": init_date,
		"end_date": end_date,
		"description": description,
		"attachments": {}
	}
	saveTaskToLocalStorage(new_task);

	event.currentTarget.submit();

}

async function showPlaceholderUpdate(id) {
	let tasks = fromlocalStorageJSONtasks();

	// use placeholder

	title = tasks[id].title;
	document.getElementById("update_Task_title").placeholder = title;

	description = tasks[id].description;
	document.getElementById("update_Task_description").placeholder = description;

	tags = tasks[id].tags;
	document.getElementById("update_Task_tags").placeholder = tags;


	document.getElementById('updateTaskForm').setAttribute('data-id', id);
}


async function updateTask(id) {

	let tasks = fromlocalStorageJSONtasks();

	// to update 

	title = document.getElementById("update_Task_title").value;
	init_date = document.getElementById("update_Task_init_date").value;
	end_date = document.getElementById("update_Task_end_date").value;
	tags = document.getElementById("update_Task_tags").value;
	description = document.getElementById("update_Task_description").value;


	updated_task = {
		"id": id,
		"title": title,
		"init_date": init_date,
		"end_date": end_date,
		"description": description,
		"attachments": {}
	}

	saveTaskToLocalStorage(updated_task);

	event.currentTarget.submit();

}




async function saveTaskToLocalStorage(task) {

	let tasks = JSON.parse(localStorage.getItem("tasks"));

	tasks[task.id] = task;

	localStorage.setItem(
		"tasks", JSON.stringify(tasks)
	)

}

function deleteTask(id) {
	let tasks = JSON.parse(localStorage.getItem("tasks"));
	tasks.splice(id, id - 1);
	localStorage.setItem("tasks", JSON.stringify(tasks));
	displayJSONtasks();

}


async function displayJSONtasks() {
	if (localStorage["tasks"] !== undefined) {
		try {
			let taskArray = await fromlocalStorageJSONtasks();
			let divTasks = document.getElementById("new_task_div");
			divTasks.innerHTML = "";
			taskArray.forEach((task) => {
				divTasks.innerHTML += `<div class="task" data-id="${task["id"]}" id=task_${task["id"]}>
	<p >
		<b> ${task["title"]}</b><br> ` +

					(task["end_date"] == "" ?
						`${task["init_date"]}` :
						`${task["init_date"]} - ${task["end_date"]}`) // if end date null, just init date

					+ `<br>
		
		${task["description"]}
	</p>
	<button class='deleteButton' onclick="deleteTask(${task["id"]})">X</button>
	<button  class='editButton' onclick="{document.getElementById('updateTaskDiv').style.display='block';
	showPlaceholderUpdate(${task["id"]});
	
}">Edit</button>
</div > `
			});
			return 1;
		} catch (error) {
			console.log(error);
			return 0;
		}
	}
	else {
		await tolocalStorageJSONtasks();
		try {
			let taskArray = await fromlocalStorageJSONtasks();
			let divTasks = document.getElementById("new_task_div");
			taskArray.forEach((task) => {
				divTasks.innerHTML += `<div class="task" id=task_${task["id"]}>
	<p >
		<b> ${task["title"]}</b><br> ` +

					(task["end_date"] == "" ?
						`${task["init_date"]}` :
						`${task["init_date"]} - ${task["end_date"]}`) // if end date null, just init date

					+ `<br>
		
		${task["description"]}
	</p>
	<button onclick="deleteTask(${task["id"]})">X</button><button>Edit</button>
</div > `
			});
			return 1;
		} catch (error) {
			console.log(error);
			return 0;
		}

	}
}

function sidebar_open() {
	document.getElementById("mySidebar").style.display = "block";
	document.getElementById("myOverlay").style.display = "block";
}

function sidebar_close() {
	document.getElementById("mySidebar").style.display = "none";
	document.getElementById("myOverlay").style.display = "none";
}

async function getJSONtasksFromFile() {
	var loadInp = document.getElementById("loadTasksInput");
	return loadInp.files[0].text().then(
		response => {
			return JSON.parse(response);
		}
	)
}


/**
		 * @param  object result
		 * This method saves json tasks in local storage
		 * metadata is erased when parsing it 
		 * 
		 * */
async function tolocalStorageJSONtasks() {
	let result = await getJSONtasksFromFile();
	let tasks = result["tasks"];

	localStorage.setItem("tasks", JSON.stringify(tasks))

}

/**
		 * This method loads json tasks from local storage
		 * returns: Array with task objects inside
		 * */
function fromlocalStorageJSONtasks() {
	let tasks = JSON.parse(localStorage.getItem("tasks"));
	return tasks;
}




/* Download localStorage tasks to computer */

const download = (path, filename) => {
	// Create a new link
	const anchor = document.createElement('a');
	anchor.href = path;
	anchor.download = filename;

	// Append to the DOM
	document.body.appendChild(anchor);

	// Trigger `click` event
	anchor.click();

	// Remove element from DOM
	document.body.removeChild(anchor);


};

function parseToDownload(){
	jsonData = new Object({ "tasks": JSON.parse(localStorage["tasks"]) });
	const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });

	const url = URL.createObjectURL(blob);
	download(url, "tasksdownloaded.json");
}
