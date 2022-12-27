let appData = {
    boards: [
        {
            title: 'Board-1',
            id: 'b1',
            cols: [
                {
                    title: 'Todo',
                    id: 'c1',
                    color: '#ff3f3f',
                    cards: [
                        {
                            title: 'first',
                            description: 'this is the first card',
                            id: 'd1',
                            subtasks: [
                                {
                                    title: 'do something',
                                    isCompleted: false,
                                    id: 's1',
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Doing',
                    id: 'c2',
                    color: '#F9EBEA',
                    cards: [
                        {
                            title: 'first second col',
                            description: 'this is the first card second col',
                            id: 'd2',
                            subtasks: [
                                {
                                    title: 'do something',
                                    isCompleted: false,
                                    id: 's2',
                                },
                                {
                                    title: 'do something2',
                                    isCompleted: false,
                                    id: 's3',
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            title: 'Board-2',
            id: 'b2',
            cols: [
                {
                    title: 'Todo2',
                    id: 'c5',
                    color: '#ff3f3f',
                    cards: [
                        {
                            title: 'first',
                            description: 'this is the first card',
                            id: 'd5',
                            subtasks: [
                                {
                                    title: 'do something',
                                    isCompleted: false,
                                    id: 's4',
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Doing2',
                    id: 'c6',
                    color: '#FFA500',
                    cards: [
                        {
                            title: 'first second col board2',
                            description: 'this is the first card second col',
                            id: 'd6',
                            subtasks: [
                                {
                                    title: 'do something',
                                    isCompleted: false,
                                    id: 's5',
                                },
                                {
                                    title: 'do something2',
                                    isCompleted: false,
                                    id: 's6',
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    currentBoard: 'b1',
    currentCol: 0,
    currentCard: 0,
    identifier: 0,
    settings: null
}

function init() {
    if (!localStorage.getItem('app_data')) {
        localStorage.setItem('app_data', JSON.stringify(appData))
    }
    data = JSON.parse(localStorage.getItem('app_data'))
    appData = data
    fillData(data)
    let cols = getCols()
    var drake = dragula(cols.map(col => document.getElementById(col.title), { revertOnSpill: true }));
}

document.body.onload = () => init()

const boardContainer = document.querySelector('#board')
const BoardSideBar = document.querySelector('#board-sidebar')

const fillData = (data) => {
    boardContainer.innerHTML = ''
    BoardSideBar.innerHTML = ''
    // create sidebar menu(boards list)
    data.boards.map((board) => {
        let boardSelection = document.createElement('div')
            boardSelection.setAttribute('id',board.id)
            boardSelection.setAttribute('onClick','changeBoard(id)')
            boardSelection.classList.add(`${data.currentBoard === board.id ? 'bg-red-300' : 'bg-green-300'}`)
            boardSelection.textContent = board.title
            BoardSideBar.append(boardSelection)
    })
    let cols = getCols()
    // create column
    cols.map(column => {
        // create column container
        let columnSection = document.createElement('section')
        columnSection.classList.add('w-72', 'h-full')
        // create column title
        let columnTitle = document.createElement('h2')
        columnTitle.classList.add('uppercase', 'flex', 'items-center')
        // create title content *Fix dot color later and number in ()* 
        let columnTitleDot = document.createElement('span')
        columnTitleDot.classList.add('h-3', 'w-3', 'block', `bg-[${column.color}]`, 'rounded-full', 'mr-3')
        let columnTitleSpan = document.createElement('span')
        columnTitleSpan.classList.add('block')
        columnTitleSpan.textContent = column.title + ' ' + '(4)'
        // create card container
        let cardContainer = document.createElement('div')
        cardContainer.classList.add('w-72', 'pt-5', 'space-y-4', 'min-h-[108px]')
        cardContainer.setAttribute('id', column.title)
        // append the column elements to the board container
        columnTitle.append(columnTitleDot, columnTitleSpan)
        columnSection.append(columnTitle, cardContainer)
        boardContainer.append(columnSection)
        // create the card container
        column.cards.map(card => {
            let cardArticle = document.createElement('article')
            cardArticle.classList.add('w-full', 'px-4', 'py-5', 'bg-[#2c2c38]')
            let cardTitle = document.createElement('h3')
            cardTitle.textContent = card.title
            let cardSubTasks = document.createElement('p')
            cardSubTasks.textContent = `0 of ${card.subtasks.length} subtasks`
            cardArticle.append(cardTitle, cardSubTasks)
            cardContainer.append(cardArticle)
        })
    })
}

const changeBoard = (id) => {
    console.log(appData)
    if (appData.currentBoard !== id ) {
        appData.currentBoard = id
        localStorage.setItem('app_data', JSON.stringify(appData))
        init()
    }
}

const getBoard = (id) => {
    let board = appData.boards.filter((board) => board.id == id)
    return board[0]
}

const getCols = () => {
    let board = getBoard(appData.currentBoard)
    let cols = board.cols
    return cols
}

const generateId = (type) => {
    nextId = appData.identifier
    appData.identifier++
    localStorage.setItem('app_data', JSON.stringify(appData))
    return `${type}-${nextId++}`;
}


const addNewTaskContainer = document.querySelector('#add-task-container')
const addNewTaskBtn = document.querySelector('#new-task-btn')
const statusSelect = document.querySelector('#status') 

const showAddNewTask = () => {
    addNewTaskBackground.removeAttribute('hidden')
    addNewTaskContainer.removeAttribute('hidden')
    let cols = getCols()
    statusSelect.innerHTML = ''
    taskContainer.innerHTML = ''
    cols.map(col => {
        let optionEl = document.createElement('option')
            optionEl.setAttribute('value', col.title)
            optionEl.textContent = col.title
        statusSelect.append(optionEl)
    })
}
addNewTaskBtn.addEventListener('click', () =>showAddNewTask())




const taskContainer = document.querySelector('#task-container')
const addNewTaskInputBtn = document.querySelector('#add-new-task-input')
const addTaskInput = (e) => {
    e.preventDefault()
    divEl = createTaskInput()
    taskContainer.append(divEl)
}
addNewTaskInputBtn.addEventListener('click', (e) =>addTaskInput(e))

const createTaskInput = (task) => {
    let divEl = document.createElement('div')
        divEl.classList.add('flex','items-center','gap-2.5')
    let inputEl = document.createElement('input')
        inputEl.classList.add('bg-[#2c2c38]','border-2','border-[#353541]','text-gray-900','text-sm','rounded-lg','w-full','p-2.5','placeholder-[#686872]','mb-3')
        inputEl.setAttribute('type', 'text')
        inputEl.setAttribute('name', 'subtask')
        inputEl.value = task ? task.title : ''
    let spanEl = document.createElement('span')
        spanEl.classList.add('block')
        spanEl.innerHTML = 
        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke-width="3" stroke="#828fa3" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>`
    divEl.append(inputEl,spanEl)
    return divEl
}




const getRandomVibrantColor = () => {
    const vibrantColors = [
        '#ff3f3f', '#FFA500', '#FFFF00', '#99cc99', '#008000', '#0000FF',
        '#4B0082', '#EE82EE', '#FF69B4', '#8B008B', '#FFD700',
        '#FF00FF', '#00FFFF','#ff9999', '#ffcc99', '#ffff99', '#99ccff',
        '#9999e6', '#ffccff', '#ff99cc', '#ffffcc', '#ff99ff', '#99ffff'];

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * vibrantColors.length);
  
    // Return the random pastel color
    return vibrantColors[randomIndex];
}

const taskForm = document.getElementById('task-form')
taskForm.addEventListener('submit', (event) => {
    // Prevent the default action (refreshing the page)
    event.preventDefault();

    // Get the form data
    const formData = new FormData(taskForm);
    // console.log(formData.getAll('subtask').filter(task => task ? task : undefined))
    let cols = getCols()
    cols.map(col => {
        if (formData.get('status') == col.title){
            col.cards.push(
                {
                title: formData.get('title'),
                description: formData.get('description'),
                id: generateId('card'),
                color: getRandomVibrantColor(),
                subtasks: formData.getAll('subtask').filter(task => {
                if(task) {
                    return  {
                            title: task,
                            isCompleted: false,
                            id: generateId('task')
                            }
                        } else undefined
                    })
                }
            )
        }
    })
    localStorage.setItem('app_data', JSON.stringify(appData));
    init()
    taskForm.reset();
});

const addNewColumnContainer = document.querySelector('#add-column-container')
const addNewColumnBtnBig = document.querySelector('#column-btn-big')
const boardName = document.querySelector('#board-name')
const columnContainer = document.querySelector('#column-container')


const showAddNewColumn = () => {
    addNewTaskBackground.removeAttribute('hidden')
    addNewColumnContainer.removeAttribute('hidden')
    let board = getBoard(appData.currentBoard)
    boardName.value = board.title
    columnContainer.innerHTML = ''
    board.cols.map(col => {
        divEl = createColumnInput(col)
        columnContainer.append(divEl)
    })
}
addNewColumnBtnBig.addEventListener('click', () =>showAddNewColumn())

const addNewColumnInputBtn = document.querySelector('#add-new-column-input')
const addColumnInput = (e) => {
    e.preventDefault()
    divEl = createColumnInput()
    columnContainer.append(divEl)
}
addNewColumnInputBtn.addEventListener('click', (e) =>addColumnInput(e))

const createColumnInput = (col) => {
    let divEl = document.createElement('div')
        divEl.classList.add('flex','items-center','gap-2.5')
    let inputEl = document.createElement('input')
        inputEl.classList.add('bg-[#2c2c38]','border-2','border-[#353541]','text-gray-900','text-sm','rounded-lg','w-full','p-2.5')
        inputEl.setAttribute('type', 'text')
        inputEl.setAttribute('name', 'column')
        inputEl.setAttribute('required', true)
        inputEl.value = col ? col.title : ''
    let spanEl = document.createElement('span')
        spanEl.classList.add('block')
        spanEl.innerHTML = 
        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke-width="3" stroke="#828fa3" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>`
    divEl.append(inputEl,spanEl)
    return divEl
}


const columnForm = document.getElementById('column-form')
columnForm.addEventListener('submit', (event) => {
    // Prevent the default action (refreshing the page)
    event.preventDefault();

    // Get the form data
    const formData = new FormData(columnForm);
    // console.log(formData.getAll('subtask').filter(task => task ? task : undefined))
    let board = getBoard(appData.currentBoard)
    board.title = formData.get('board-name')
    data = formData.getAll('column')
    data.map((col,i) => {
        if(board.cols[i]) {
            board.cols[i].title = col
        } else {
            board.cols.push({
                title: col,
                id: generateId('column'),
                color: getRandomVibrantColor(),
                cards: []
            })
        }
    })
    localStorage.setItem('app_data', JSON.stringify(appData));
    init()
});


const addNewTaskBackground = document.querySelector('#add-task-background')
const hideAddNewTask = () => {
    addNewTaskBackground.setAttribute('hidden',true)
    addNewTaskContainer.setAttribute('hidden',true)
    addNewColumnContainer.setAttribute('hidden',true)
    taskForm.reset();
}
addNewTaskBackground.addEventListener('click', (e) => {
    console.log(e)
    if(e.target.id === addNewTaskBackground.id) hideAddNewTask();
})
