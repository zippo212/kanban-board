
/* <=================================== Elements / Variables ===================================> */
// Overall containers
const boardContainer = document.querySelector('#board')
const BoardSideBar = document.querySelector('#board-sidebar')

// new task modal
const addNewTaskContainer = document.querySelector('#add-task-container')
const addNewTaskBtn = document.querySelector('#new-task-btn')
const statusSelect = document.querySelector('#status') 
const taskContainer = document.querySelector('#task-container')
const addNewTaskInputBtn = document.querySelector('#add-new-task-input')
const taskForm = document.getElementById('task-form')

// new column modal
const addNewColumnContainer = document.querySelector('#add-column-container')
const addNewColumnBtnBig = document.querySelector('#column-btn-big')
const boardName = document.querySelector('#board-name')
const columnContainer = document.querySelector('#column-container')
const addNewColumnInputBtn = document.querySelector('#add-new-column-input')
const columnForm = document.getElementById('column-form')

// new board modal
const addNewBoardContainer = document.querySelector('#add-board-container')
const addNewBoardBtn = document.querySelector('#add-board-btn')
const newBoardColumnContainer = document.querySelector('#new-board-column-container')
const addNewBoardInputBtn = document.querySelector('#add-new-board-column-input')
const boardForm = document.getElementById('board-form')


const toggleBackground = document.querySelector('#toggle-background')


let appData = {
    boards: [],
    currentBoard: 0,
    currentCol: 0,
    currentCard: 0,
    identifier: 0,
    settings: null
}
/* <============================================================================================> */

function init() {
    let data = localStorage.getItem('app_data');
    if (data) {
        appData = JSON.parse(data)
        fillData(appData)
        setUpDragula()
    } else {
        let defaultBoard = {
            boards: [
                    {
                    title: 'Your First Board',
                    id: 'b-1',
                    cols: [
                        {
                        title: 'Column',
                        id: 'c-1',
                        color: '#FFA500',
                        cards: [
                            {
                            title: 'First Card',
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
                    ]
                },
            ],
            currentBoard: 'b-1',
            currentCol: 0,
            currentCard: 0,
            identifier: 0,
            settings: null
        }
        appData = defaultBoard
        localStorage.setItem('app_data', JSON.stringify(appData))
        fillData(appData)
        setUpDragula()
    }
}
document.body.onload = () => init()

// update dragula with current board for drag functionality
const setUpDragula = () => {
    let cols = getCols()
    var drake = dragula(cols.map(col => document.getElementById(col.id), { revertOnSpill: true }));
}

// fill the current board with the appropriate elements created from the data
const fillData = (data) => {
    boardContainer.innerHTML = ''
    BoardSideBar.innerHTML = ''
    // create sidebar menu(boards list)
    data.boards.map((board) => {
        let boardSelection = document.createElement('div')
            boardSelection.setAttribute('id',board.id)
            boardSelection.setAttribute('onClick','changeBoard(id)')
            boardSelection.className = `${data.currentBoard === board.id ? 'bg-[#635fc7] text-white fill-white' : 'bg-transparent text-[#828fa3] fill-[#828fa3]'} text-base font-semibold pl-5 py-3 rounded-r-full hover:bg-[#635fc71a] hover:text-[#635fc7] cursor-pointer gap-4 flex items-center hover:fill-[#635fc7]`
            svgDiv = document.createElement('div')
            svgDiv.innerHTML = '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"></path></svg>'
            spanEl = document.createElement('span')
            spanEl.textContent = board.title
            boardSelection.append(svgDiv,spanEl)
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
        cardContainer.setAttribute('id', column.id)
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

/* <=================================== Utility Functions ===================================> */

// change the current board value to the new value based on the id and update the view accordingly
const changeBoard = (id) => {
    if (appData.currentBoard !== id ) {
        appData.currentBoard = id
        localStorage.setItem('app_data', JSON.stringify(appData))
        init()
    }
}
// return the current board 
const getBoard = (id) => {
    let board = appData.boards.filter((board) => board.id == id)
    return board[0]
}
// return the columns array for the current board
const getCols = () => {
    let board = getBoard(appData.currentBoard)
    let cols = board.cols
    return cols
}
// generate id based on the type of element and identifier value
const generateId = (type) => {
    nextId = appData.identifier
    // increment identifier after each use to ensure that the id is new
    appData.identifier++
    localStorage.setItem('app_data', JSON.stringify(appData))
    return `${type}-${nextId++}`;
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

/* <=================================== Modals ===================================> */
// show add new task modal
const showAddNewTask = () => {
    toggleBackground.removeAttribute('hidden')
    addNewTaskContainer.removeAttribute('hidden')
    let cols = getCols()
    statusSelect.innerHTML = ''
    taskContainer.innerHTML = ''
    cols.map(col => {
        let optionEl = document.createElement('option')
            optionEl.setAttribute('value', col.id)
            optionEl.textContent = col.title
        statusSelect.append(optionEl)
    })
}
addNewTaskBtn.addEventListener('click', () =>showAddNewTask())

// add input element and append it to inputs container
const addTaskInput = (e) => {
    e.preventDefault()
    let divEl = createInput('','subtask')
    taskContainer.append(divEl)
}
addNewTaskInputBtn.addEventListener('click', (e) =>addTaskInput(e))

// get the form data on submit
taskForm.addEventListener('submit', (event) => {
    // Prevent the default action (refreshing the page)
    event.preventDefault();

    // Get the form data
    const formData = new FormData(taskForm);
    let cols = getCols()
    cols.map(col => {
        if (formData.get('status') == col.id){
            col.cards.push(
                {
                title: formData.get('title'),
                description: formData.get('description'),
                id: generateId('card'),
                subtasks: formData.getAll('subtask').filter(task => task !== '').map(task => {
                    return  {
                            title: task,
                            isCompleted: false,
                            id: generateId('task')
                            }
                    })
                }
            )
        }
    })
    localStorage.setItem('app_data', JSON.stringify(appData));
    init()
    taskContainer.innerHTML = ''
    taskForm.reset();
});


// show add new column modal
const showAddNewColumn = () => {
    toggleBackground.removeAttribute('hidden')
    addNewColumnContainer.removeAttribute('hidden')
    let board = getBoard(appData.currentBoard)
    boardName.value = board.title
    columnContainer.innerHTML = ''
    board.cols.map(col => {
        divEl = createInput(col.title, 'column')
        columnContainer.append(divEl)
    })
}
addNewColumnBtnBig.addEventListener('click', () =>showAddNewColumn())

// add input element and append it to inputs container
const addColumnInput = (e) => {
    e.preventDefault()
    divEl = createInput('', 'column')
    columnContainer.append(divEl)
}
addNewColumnInputBtn.addEventListener('click', (e) =>addColumnInput(e))

// get the form data on submit
columnForm.addEventListener('submit', (event) => {
    // Prevent the default action (refreshing the page)
    event.preventDefault();
    // Get the form data
    const formData = new FormData(columnForm);
    let board = getBoard(appData.currentBoard)
    board.title = formData.get('board-name')
    let data = formData.getAll('column')
    console.log(data)
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
    console.log(appData)
    localStorage.setItem('app_data', JSON.stringify(appData));
    init()
});


// show add new board modal
const showAddNewBoard = () => {
    toggleBackground.removeAttribute('hidden')
    addNewBoardContainer.removeAttribute('hidden')
}
addNewBoardBtn.addEventListener('click', () =>showAddNewBoard())

// add input element and append it to inputs container
const addNewBoardColumnInput = (e) => {
    e.preventDefault()
    divEl = createInput('', 'new-board-column')
    newBoardColumnContainer.append(divEl)
}
addNewBoardInputBtn.addEventListener('click', (e) =>addNewBoardColumnInput(e))


// get the form data on submit
boardForm.addEventListener('submit', (event) => {
    // Prevent the default action (refreshing the page)
    event.preventDefault();

    // Get the form data
    const formData = new FormData(boardForm);
    let data = appData
    console.log(data)
    data.boards.push(
        {
            title: formData.get('new-board-name'),
            id: generateId('board'),
            cols: formData.getAll('new-board-column').filter(col => col !== '').map(col => {
                    return  {
                            title: col,
                            id: generateId('column'),
                            color: getRandomVibrantColor(),
                            cards: []
                            }
                    })
        }
    )
    localStorage.setItem('app_data', JSON.stringify(appData));
    init()
    newBoardColumnContainer.innerHTML = ''
    boardForm.reset()
});


// create input element
const createInput = (title,name) => {
    let divEl = document.createElement('div')
        divEl.classList.add('flex','items-center','gap-2.5')
    let inputEl = document.createElement('input')
        inputEl.classList.add('bg-[#2c2c38]','border-2','border-[#353541]','text-gray-900','text-sm','rounded-lg','w-full','p-2.5','placeholder-[#686872]','mb-3')
        inputEl.setAttribute('type', 'text')
        inputEl.setAttribute('name', name )
        name === 'column' ? inputEl.setAttribute('required', true) : ''
        inputEl.value = title
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

// hide the modal and reset to default
const hideModal = () => {
    toggleBackground.setAttribute('hidden',true)
    addNewTaskContainer.setAttribute('hidden',true)
    addNewColumnContainer.setAttribute('hidden',true)
    addNewBoardContainer.setAttribute('hidden',true)
    taskForm.reset();
    boardForm.reset()
}
toggleBackground.addEventListener('click', (e) => {
    console.log(e)
    if(e.target.id === toggleBackground.id) hideModal();
})
/* <==============================================================================> */
