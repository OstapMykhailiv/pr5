const addTask = document.getElementById('task');
const tasks = document.getElementById('tasks')
const sort1 = document.getElementById('sort1')
const sort2 = document.getElementById('sort2')

document.addEventListener('DOMContentLoaded', ()=>{
    let savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        let tasksArray = JSON.parse(savedTasks);
        for (let i = 0; i<tasksArray.length; i++){
            displayTask(tasksArray[i], i);
        }
    }
})

document.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && check() !== 0) {
        let taskValue = addTask.value;

        let newTask = {
            text: taskValue,
            completed: false,
            date: new Date().toLocaleString(),
        };

        saveTask(newTask);
        displayTask(newTask);
        addTask.value = '';
    }
});

function saveTask(thisTask, index) {
    let existingTasks = localStorage.getItem('tasks') || '[]';
    let tasksArray = JSON.parse(existingTasks);

    if (index !== undefined && index >= 0 && index < tasksArray.length) {
        tasksArray[index] = thisTask;
    } else {
        thisTask.completed = false;
        tasksArray.push(thisTask);
    }

    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

function displayTask(thisTask, index){
    let div = document.createElement('div')
    div.className = 'todo-element'

    let checkbox = document.createElement('input')
    let checkboxDiv = document.createElement('div')
    checkbox.type = 'checkbox'
    checkboxDiv.className = 'checkbox-div'
    checkboxDiv.append(checkbox)

    let txt = document.createElement('div')
    txt.className = 'txt'
    txt.innerText = thisTask.text;
    txt.addEventListener('dblclick', changeTask)
    let text = thisTask.text

    let dateDiv = document.createElement('div')
    dateDiv.innerText = thisTask.date
    dateDiv.className = 'date-div'

    if (thisTask.completed){
        checkbox.remove()
        txt.style.textDecoration = 'line-through'
        txt.removeEventListener('dblclick', changeTask)
        div.style.background = 'grey'
        dateDiv.style.color = 'black'
    }

    let button = document.createElement('button')
    button.textContent = 'X'
    button.addEventListener("click", () => {
        if (confirm("Ви впевнені, що хочете видалити цей елемент?")){
            div.remove()
            let tasksArray = JSON.parse(localStorage.getItem('tasks'));
            tasksArray.splice(index, 1)
            localStorage.setItem('tasks', JSON.stringify(tasksArray));
        }
    })

    let rightWrapper = document.createElement('div')
    rightWrapper.append(button, dateDiv)
    rightWrapper.className = 'right-wrapper'
    div.append(checkboxDiv, txt, rightWrapper)
    tasks.appendChild(div)

    checkbox.addEventListener('change', ()=>{
        checkbox.style.display = 'none'
        txt.style.textDecoration = 'line-through'
        div.style.background = 'grey'
        dateDiv.style.color = 'black'
        thisTask.completed = true
        txt.removeEventListener('dblclick', changeTask)
        saveTask(thisTask, index)
    })


    function changeTask() {
        checkbox.style.display = 'none'
        let inputFiled = document.createElement('input');
        inputFiled.value = text
        inputFiled.className = 'task'

        let yes = document.createElement('button')
        yes.textContent = 'Yes'
        yes.style.color = 'green'
        let no = document.createElement('button')
        no.textContent = 'No'
        no.style.color = 'red'

        let div = document.createElement('div')
        div.className = 'y-n-wrapper'
        div.append(yes, no)

        txt.innerHTML = ''
        txt.append(inputFiled, div)

        no.addEventListener('click', () => {
            txt.innerHTML = ''
            txt.innerText = thisTask.text
            checkbox.style.display = 'initial'
        })
        yes.addEventListener('click', () => {
            text = inputFiled.value
            if (checkOnChange(text, index) === 0){
                txt.innerHTML = ''
                txt.innerText = thisTask.text
                checkbox.style.display = 'initial'
            }
            else{
                txt.innerHTML = ''
                thisTask.text = text
                txt.innerText = text
                saveTask(thisTask, index)
                checkbox.style.display = 'initial'
            }
        })
    }
}

// сортування за зроблене/не зроблене
sort1.addEventListener('click', ()=>{
    let tasksArray = JSON.parse(localStorage.getItem('tasks'))
    tasksArray.sort((a, b) => {
        if (a.completed && !b.completed) {
            return 1;
        }
        if (!a.completed && b.completed) {
            return -1;
        }
        return 0;
    });
    localStorage.setItem('tasks', JSON.stringify(tasksArray))

    let tasksContainer = document.getElementById('tasks');
    while (tasksContainer.firstChild) {
        tasksContainer.firstChild.remove();
    }

    tasksArray.forEach((task, index) => {
        displayTask(task, index, tasksContainer);
    });
})

// сортування за датою
sort2.addEventListener('click', ()=>{
    let tasksArray = JSON.parse(localStorage.getItem('tasks'))
    tasksArray.sort((a, b) => parseCustomDate(a.date).getTime() - parseCustomDate(b.date).getTime());
    localStorage.setItem('tasks', JSON.stringify(tasksArray))

    let tasksContainer = document.getElementById('tasks');
    while (tasksContainer.firstChild) {
        tasksContainer.firstChild.remove();
    }

    tasksArray.forEach((task, index) => {
        displayTask(task, index, tasksContainer);
    });
})
function check() {
    if (addTask.value === '') {
        alert('Поле пусте')
        return 0
    }
    let tasksArray = JSON.parse(localStorage.getItem('tasks'))
    for (let i = 0; i<tasksArray.length; i++){
        if (addTask.value === tasksArray[i].text){
            alert('Даний елемент вже існує у списку')
            return 0
        }
    }
}
function checkOnChange(textToChange, index){
    if (textToChange === '') {
        alert('Поле пусте')
        return 0
    }
    let tasksArray = JSON.parse(localStorage.getItem('tasks'))
    for (let i = 0; i<tasksArray.length; i++){
        if (textToChange === tasksArray[i].text && index !== i){
            alert('Даний елемент вже існує у списку')
            return 0
        }
    }
}
function parseCustomDate(dateString) {
    const [dayMonthYear, time] = dateString.split(', ');
    const [day, month, year] = dayMonthYear.split('.');
    const [hours, minutes, seconds] = time.split(':');

    return new Date(year, month - 1, day, hours, minutes, seconds);
}