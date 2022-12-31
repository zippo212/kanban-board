
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

// card modal
const cardContainer = document.querySelector('#card-modal')
const cardTitle = document.querySelector('#card-title')
const cardDescription = document.querySelector('#card-description')
const cardSubTasksLabel = document.querySelector('#card-tasks-label')
const divCheckBoxEl = document.querySelector('#card-checkbox')
const selectStatusEl = document.querySelector('#card-status-select')

// edit board header component
const showEditBoardBtn = document.querySelector('#edit-board-btn')
const editBoardContainer = document.querySelector('#show-edit-board')
const deleteBoardContainer = document.querySelector('#delete-board-container')
const deleteBoardBtn = document.querySelector('#delete-board-btn')


const toggleBackground = document.querySelector('#toggle-background')


let appData = {
    boards: [],
    currentBoard: 0,
    currentCol: 0,
    currentCard: 0,
    identifier: 0,
    settings: null
}

// initialize empty array to track columns for removal
let columns = []

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
                        color: 'bg-[#FFA500]',
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
        columnTitleDot.classList.add('h-3.5', 'w-3.5', 'block', `${column.color}`, 'rounded-full', 'mr-3')
        let columnTitleSpan = document.createElement('span')
        columnTitleSpan.classList.add('block','text-[#828fa3]','font-medium','tracking-widest')
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
            cardArticle.classList.add('w-full', 'px-4', 'py-4', 'bg-[#2c2c38]','rounded-lg','shadow-card','card')
            cardArticle.setAttribute('id',card.id)
            let cardTitle = document.createElement('h3')
            cardTitle.className = 'text-white font-semibold pb-[2px] pointer-events-none'
            cardTitle.textContent = card.title
            let cardSubTasks = document.createElement('p')
            cardSubTasks.className = 'text-[#828fa3] font-medium text-[13px] pointer-events-none'
            cardSubTasks.textContent = `0 of ${card.subtasks.length} subtasks`
            cardArticle.append(cardTitle, cardSubTasks)
            cardContainer.append(cardArticle)
        })
    })
    // get all the cards
    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click',(e)=>showCard(e))
    }
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
// return all the data for specific card
const getCardInfo = () => {
    let data = appData
    let cols = getCols()
    console.log(cols)
    const colIndex = cols.findIndex(col => col.id === data.currentCol);
    console.log(colIndex)
    const cardIndex = cols[colIndex].cards.findIndex(card => card.id === data.currentCard);
    let card = cols[colIndex].cards[cardIndex]
    return card
}

const getRandomVibrantColor = () => {
    const vibrantColors = [
        'bg-[#ff3f3f]', 'bg-[#FFA500]', 'bg-[#FFFF00]', 'bg-[#99cc99]', 'bg-[#008000]', 'bg-[#0000FF]',
        'bg-[#4B0082]', 'bg-[#EE82EE]', 'bg-[#FF69B4]', 'bg-[#8B008B]', 'bg-[#FFD700]',
        'bg-[#FF00FF]', 'bg-[#00FFFF]','bg-[#ff9999]', 'bg-[#ffcc99]', 'bg-[#ffff99]', 'bg-[#99ccff]',
        'bg-[#9999e6]', 'bg-[#ffccff]', 'bg-[#ff99cc]', 'bg-[#ffffcc]', 'bg-[#ff99ff]', 'bg-[#99ffff]',
        'bg-[#FF4500]', 'bg-[#6495ED]', 'bg-[#7CFC00]', 'bg-[#FF1493]', 'bg-[#00BFFF]']
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
    console.log('test')
    // Prevent the default action (refreshing the page)
    event.preventDefault();
    let cols = getCols()
    // Get the form data
    const formData = new FormData(taskForm);
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
    editBoardContainer.setAttribute('hidden',true)
    let board = getBoard(appData.currentBoard)
    boardName.value = board.title
    columnContainer.innerHTML = ''
    board.cols.map(col => {
        divEl = createInput(col.title, 'column', col.id)
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
    // if columns not empty then go over each id find that index and splice it out
    if(columns.length > 0){
        columns.forEach(col => {
            const index = board.cols.findIndex(elem => elem.id === col);
            board.cols.splice(index, 1);
        })
    }
    let data = formData.getAll('column')
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
    // reset the columns array
    columns = []
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
    let boardId = generateId('board')
    data.boards.push(
        {
            title: formData.get('new-board-name'),
            id: boardId,
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
    data.currentBoard = boardId
    localStorage.setItem('app_data', JSON.stringify(appData));
    init()
    newBoardColumnContainer.innerHTML = ''
    boardForm.reset()
});


// create input element
const createInput = (title,name,id) => {
    let divEl = document.createElement('div')
        divEl.classList.add('flex','items-center','gap-2.5')
        // if id is passed add it to the div
        id ? divEl.setAttribute('id', id ) : ''
    let inputEl = document.createElement('input')
        inputEl.classList.add('bg-[#2c2c38]','border-2','border-[#353541]','text-gray-900','text-sm','rounded-lg','w-full','p-2.5','placeholder-[#686872]')
        inputEl.setAttribute('type', 'text')
        inputEl.setAttribute('name', name )
        name === 'column' ? inputEl.setAttribute('required', true) : ''
        inputEl.value = title
    let svgEl = document.createElement('span')
        svgEl.className = 'material-symbols-sharp text-[#828fa3] hover:text-red-400 cursor-pointer'
        svgEl.setAttribute('onclick',"removeTaskInput(event)")
        svgEl.textContent = 'close'
    divEl.append(inputEl,svgEl)
    return divEl
}


// remove input element
const removeTaskInput = (e) => {
    let id = e.path[1].id
    let inputEl = e.path[1]
        // remove the input from the DOM
        inputEl.remove()
    // if id is passed push it to the empty array columns
    if(id) {
        columns.push(id)
    }
}


// hide the modal and reset to default
const hideModal = () => {
    toggleBackground.setAttribute('hidden',true)
    addNewTaskContainer.setAttribute('hidden',true)
    addNewColumnContainer.setAttribute('hidden',true)
    addNewBoardContainer.setAttribute('hidden',true)
    editBoardContainer.setAttribute('hidden',true)
    deleteBoardContainer.setAttribute('hidden',true)
    cardContainer.setAttribute('hidden',true)
    cardModal = document.getElementById('modal')
    if(cardModal) cardModal.remove()
    taskForm.reset();
    boardForm.reset()
    // reset the columns array
    columns = []
}
toggleBackground.addEventListener('click', (e) => {
    if(e.target.id === toggleBackground.id) hideModal();
})

// show the header component
const showEditBoard = () => {
    toggleBackground.removeAttribute('hidden')
    editBoardContainer.removeAttribute('hidden')
}
showEditBoardBtn.addEventListener('click',showEditBoard) 

// show delete board modal
const showDeleteBoard = () => {
    editBoardContainer.setAttribute('hidden',true)
    deleteBoardContainer.removeAttribute('hidden')
}

// delete board function
const deleteBoard = () => {
    let data = appData
    // check if there's more than one board (minimum one is required)
    if (data.boards.length > 1) {
        // find the board index
        const index = data.boards.findIndex(elem => elem.id === data.currentBoard);
        // splice it out
        data.boards.splice(index, 1);
        // set the new current board value to the previous board
        data.currentBoard = index === 0 ? data.boards[index].id : data.boards[index-1].id
        // save and initialize
        localStorage.setItem('app_data', JSON.stringify(appData));
        init()
        hideModal()
        alert('sucsses')
    } else {
        // display error message
        hideModal()
        alert('error')
    }
}
deleteBoardBtn.addEventListener('click',deleteBoard)

// card component
const showCard = (e) => {
    cardContainer.removeAttribute('hidden')
    toggleBackground.removeAttribute('hidden')
    divCheckBoxEl.innerHTML = ''
    selectStatusEl.innerHTML = ''
    let data = appData
    data.currentCard = e.target.id
    data.currentCol = e.path[1].id
    let card = getCardInfo()
    cardTitle.textContent = card.title
    cardDescription.textContent = card.description
    updateSubTasks(card)
    let cols = getCols()
    const defaultOption = document.createElement('option')
    defaultOption.value =  data.currentCol
    const defaultOptionTitle = cols.findIndex(col => col.id === data.currentCol)
    defaultOption.textContent = cols[defaultOptionTitle].title
    defaultOption.selected = true;
    selectStatusEl.append(defaultOption)
        cols.map(col => {
            if (col.id !== defaultOption.value) {
            let optionEl = document.createElement('option')
                optionEl.setAttribute('value', col.id)
                optionEl.textContent = col.title
            selectStatusEl.append(optionEl)
            }
        })
}

const updateSubTasks = (card) => {
    let length = card.subtasks.length
    let completedLength = card.subtasks.filter(task => task.isCompleted).length
    cardSubTasksLabel.textContent = `Subtasks (${completedLength} of ${length})`
    card.subtasks.map((task) =>{
            let inputDiv = document.createElement('div')
            inputDiv.className = 'flex items-center px-3 rounded-lg bg-[#21212d] my-2'
            let inputEl = document.createElement('input')
            inputEl.className = 'w-[18px] h-[18px] accent-[#635fc7] text-blue-500 rounded-sm cursor-pointer group'
            inputEl.setAttribute('type', 'checkbox')
            inputEl.setAttribute('id', task.id)
            inputEl.setAttribute('name', 'task-checkbox')
            let labelEl = document.createElement('label')
            labelEl.className = 'py-4 ml-3 w-full text-[13px] font-bold text-white cursor-pointer group-checked:line-through'
            labelEl.setAttribute('for', task.id)
            labelEl.textContent = task.title
            inputDiv.append(inputEl,labelEl)
            divCheckBoxEl.append(inputDiv)
        })
}

const updateCardStatus = (e) => {
    data = appData
    let oldCols = getCols()
    const oldColIndex = oldCols.findIndex(col => col.id === data.currentCol)
    const oldCardIndex = oldCols[oldColIndex].cards.findIndex(card => card.id === data.currentCard)
    const removedCard = oldCols[oldColIndex].cards.splice(oldCardIndex, 1)[0];
    data.currentCol = e.target.value
    let newCols = getCols()
    const newColIndex = newCols.findIndex(col => col.id === data.currentCol)
    newCols[newColIndex].cards.push(removedCard)
    localStorage.setItem('app_data', JSON.stringify(appData))
    init()
}
selectStatusEl.addEventListener('change',(e)=>updateCardStatus(e))
/* <==============================================================================> */
