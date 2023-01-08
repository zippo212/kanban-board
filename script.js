
/* <=================================== Elements / Variables ===================================> */
// Overall containers
const boardContainer = document.querySelector('#board')
const BoardSideBar = document.querySelector('#board-sidebar')
const BoardSideBarMobile = document.querySelector('#board-sidebar-mobile')

// new task modal
const addNewTaskBtn = document.querySelectorAll('.new-task-btn')

// edit task modal

// new column modal
const addNewColumnBtnBig = document.querySelector('#column-btn-big')

// new board modal
const addNewBoardBtn = document.querySelector('#add-board-btn')

// card modal

// edit board header component
const showEditBoardBtn = document.querySelectorAll('.edit-board-btn')
const editBoardContainer = document.querySelectorAll('.show-edit-board')

// edit card header component
const deleteCardContainer = document.querySelector('#delete-card-container')
const deleteCardBtn = document.querySelector('#delete-card-btn')

// sidebar and header
const sidebarTitle = document.querySelector('#all-boards-title')
const headerBoardName = document.querySelectorAll('.header-board-name')

// mobile board menu
const mobileBoardMenu = document.querySelector('#mobile-board-menu')

const toggleBackground = document.querySelector('#toggle-background')

// theme toggle button
const toggleThemeBtn = document.querySelector('#toggle-theme')

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
    const data = localStorage.getItem('app_data');
    if (data) {
        appData = JSON.parse(data)
        fillData(appData)
        setUpDragula()
    } else {
        let defaultBoard ={
            boards: [
                      {
                        title: 'Welcome',
                        id: 'default-board-1',
                        cols: [
                                {
                                  title: 'Hello',
                                  id: 'default-column-1',
                                  color: 'bg-[#FFA500]',
                                  cards: [
                                      {
                                        title: "Hey! My name is card, im here to help you organize and follow the tasks you need to do",
                                        description: 'Here you would elaborate about whatever needs to be done',
                                        id: 'default-card-1',
                                        subtasks: [
                                                    {
                                                      title: 'For exemple "Do Something"',
                                                      isCompleted: false,
                                                      id: 'default-task-1',
                                                    },
                                                    {                                   
                                                      title: "Or if it's already done you can just check it out 'Done'",
                                                      isCompleted: true,
                                                      id: 'default-task-2',
                                                    },
                                                  ]
                                      }
                                          ]       
                                  },
                              ]
                        },
                        {
                        title: 'You can also make more boards of course!',
                        id: 'default-board-2',
                        cols: [
                                {
                                  title: 'Column number 1',
                                  id: 'default-column-2',
                                  color: 'bg-[#FFA500]',
                                  cards: [
                                      {
                                        title: 'You can also drag cards into position try dragging me to Column number 2',
                                        description: 'try to drag me :)',
                                        id: 'default-card-2',
                                        subtasks: [
                                                    {
                                                      title: 'Did you drag me ?',
                                                      isCompleted: false,
                                                      id: 'default-task-3',
                                                    }
                                                  ]
                                      }
                                          ]       
                                  },
                                  {
                                  title: 'Column number 2',
                                  id: 'default-column-3',
                                  color: 'bg-[#ff9999]',
                                  cards: [
                                      {
                                        title: 'Try to drag the card above or under me',
                                        description: "Isn't it cool ? :)",
                                        id: 'default-card-3',
                                        subtasks: [
                                                    {
                                                      title: 'Good job!',
                                                      isCompleted: true,
                                                      id: 'default-task-4',
                                                    }
                                                  ]
                                      }
                                          ]       
                                  },
                              ]
                          },
                      ],
                      currentBoard: 'default-board-1',
                      currentCol: 0,
                      currentCard: 0,
                      identifier: 0,
                      theme: 'dark',
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
    updatePositionOnDrop(drake,cols)
}

const updatePositionOnDrop = (drake,cols) => {
    drake.on('drop', (el, target, source, sibling) => {
        const sourceCol = cols.filter(col => col.id === source.id)[0]
        const cardIndex = sourceCol.cards.findIndex(card => card.id === el.id)
        const removedCard = sourceCol.cards.splice(cardIndex, 1)[0]
        const targetCol = cols.filter(col => col.id === target.id)[0]
        if (sibling) {
            const insertBeforeCard = targetCol.cards.findIndex(card => card.id === sibling.id)
            targetCol.cards.splice(insertBeforeCard,0,removedCard)
        } else {
            targetCol.cards.push(removedCard)
        }
        localStorage.setItem('app_data', JSON.stringify(appData));
        init()
    });
}

// fill the current board with the appropriate elements created from the data
const fillData = (data) => {
    toggleThemeBtn.checked = data.theme === 'dark' ? true : false;
    boardContainer.innerHTML = ''
    BoardSideBar.innerHTML = ''
    // create sidebar menu(boards list)
    sidebarTitle.textContent = `All Boards (${data.boards.length})`
    headerBoardName.forEach(title => {
        title.textContent = getBoard(appData.currentBoard).title
    })
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
        columnTitleDot.classList.add('h-4', 'w-4', 'block', `${column.color}`, 'rounded-full', 'mr-3')
        let columnTitleSpan = document.createElement('span')
        columnTitleSpan.classList.add('block','text-[#828fa3]','font-semibold','tracking-normal','text-sm')
        columnTitleSpan.textContent = column.title + ' ' + `(${column.cards.length})`
        // create card container
        let cardContainer = document.createElement('div')
        cardContainer.classList.add('w-72', 'pt-5', 'space-y-4', 'min-h-[108px]','pb-7')
        cardContainer.setAttribute('id', column.id)
        // append the column elements to the board container
        columnTitle.append(columnTitleDot, columnTitleSpan)
        columnSection.append(columnTitle, cardContainer)
        boardContainer.append(columnSection)
        // create the card container
        column.cards.map(card => {
            let cardArticle = document.createElement('article')
            cardArticle.classList.add('w-full','px-4','py-4','bg-white','dark:bg-[#2c2c38]','rounded-lg','shadow-card','card','group','cursor-pointer')
            cardArticle.setAttribute('id',card.id)
            let cardTitle = document.createElement('h3')
            cardTitle.className = 'dark:text-white font-semibold pb-[2px] pointer-events-none group-hover:text-[#655ec8]'
            cardTitle.textContent = card.title
            let cardSubTasks = document.createElement('p')
            cardSubTasks.className = 'text-[#828fa3] font-semibold text-[13px] pointer-events-none'
            cardSubTasks.textContent = `${card.subtasks.filter(task => task.isCompleted).length} of ${card.subtasks.length} subtasks`
            cardArticle.append(cardTitle, cardSubTasks)
            cardContainer.append(cardArticle)
        })
    })
    // get all the cards
    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click',(e)=>showCard(e))
    }
    document.addEventListener("DOMContentLoaded",document.querySelector('body').classList.add('opacity-100'))
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
    const colIndex = cols.findIndex(col => col.id === data.currentCol);
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
    const container = createBaseContainer('add-task-container')
    const innerContainer = createBaseInner('Add New Task')
    const form = createForm('task-form')
    const formTitle = createFormTitle('Title','title','e.g. Take coffee break',true,'task')
    const formDescription = createDescriptionForm('description',"e.g. It's always good to take a break, This 15 minutes break will recharge the batteries a little.")
    const formFieldSet = createFieldSetFrom(true,'Subtasks','task-container','add-new-task-input','+ Add New SubTask','task')
    const formStatus = createStatusFrom('status')
    const formSubmitBtn = createSubmitBtnForm('Create Task')

    form.append(formTitle)
    form.append(formDescription)
    form.append(formFieldSet)
    form.append(formStatus)
    form.append(formSubmitBtn)
    form.addEventListener('submit', (e) => onTaskFormSubmit(e,form,container))

    innerContainer.append(form)
    container.append(innerContainer)
    document.body.append(container)
    modalBackground(container)
}
addNewTaskBtn.forEach(el => el.addEventListener('click',showAddNewTask))

// add input element and append it to inputs container
const addTaskInput = (e,taskContainer) => {
    e.preventDefault()
    let divEl = createInput('','subtask')
    taskContainer.append(divEl)
}

// get the form data on submit
const onTaskFormSubmit = (e,form,container) => {
    // Prevent the default action (refreshing the page)
    e.preventDefault();
    let cols = getCols()
    // Get the form data
    const formData = new FormData(form);
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
    toggleBackground.setAttribute('hidden',true);
    // remove card here
    container.remove();
}

// show add new column modal
const showAddNewColumn = () => {
    const container = createBaseContainer('add-column-container')
    const innerContainer = createBaseInner('Edit Board')
    const form = createForm('column-form')
    const formTitle = createFormTitle('Board Name','board-name',false,true,'column')
    const formFieldSet = createFieldSetFrom(false,'Board Columns','column-container','add-new-column-input','+ Add New Column','column')
    const formSubmitBtn = createSubmitBtnForm('Save Changes')

    form.append(formTitle)
    form.append(formFieldSet)
    form.append(formSubmitBtn)
    form.addEventListener('submit', (e) => onColumnFormSubmit(e,form,container))

    innerContainer.append(form)
    container.append(innerContainer)
    document.body.append(container)
    modalBackground(container)
}
addNewColumnBtnBig.addEventListener('click',showAddNewColumn)

// add input element and append it to inputs container
const addColumnInput = (e,columnContainer) => {
    e.preventDefault()
    divEl = createInput('', 'column')
    columnContainer.append(divEl)
}

// get the form data on submit
const onColumnFormSubmit = (e,form,container) => {
    // Prevent the default action (refreshing the page)
    e.preventDefault();
    // Get the form data
    const formData = new FormData(form);
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
    toggleBackground.setAttribute('hidden',true);
    // reset the columns array
    columns = []
    container.remove();
};

// show add new board modal
const showAddNewBoard = () => {
    const container = createBaseContainer('add-board-container')
    const innerContainer = createBaseInner('Add New Board')
    const form = createForm('board-form')
    const formTitle = createFormTitle('Board Name','new-board-name','e.g. Web Design',true,'board')
    const formFieldSet = createFieldSetFrom(true,'Board Columns','new-board-column-container','add-new-board-column-input','+ Add New Column','board')
    const formSubmitBtn = createSubmitBtnForm('Create New Board')

    form.append(formTitle)
    form.append(formFieldSet)
    form.append(formSubmitBtn)
    form.addEventListener('submit', (e) => onBoardFormSubmit(e,form,container))

    innerContainer.append(form)
    container.append(innerContainer)
    document.body.append(container)
    modalBackground(container)
}
addNewBoardBtn.addEventListener('click',showAddNewBoard)

// add input element and append it to inputs container
const addNewBoardColumnInput = (e,newBoardColumnContainer) => {
    e.preventDefault()
    divEl = createInput('', 'new-board-column')
    newBoardColumnContainer.append(divEl)
}

// // get the form data on submit
const onBoardFormSubmit = (e,form,container) => {
    // Prevent the default action (refreshing the page)
    e.preventDefault();
    // Get the form data
    const formData = new FormData(form);
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
    toggleBackground.setAttribute('hidden',true);
    container.remove();
};

// create input element
const createInput = (title,name,id) => {
    let divEl = document.createElement('div')
        divEl.classList.add('flex','items-center','gap-2.5')
        // if id is passed add it to the div
        id ? divEl.setAttribute('id', id ) : ''
    let inputEl = document.createElement('input')
        inputEl.classList.add('dark:bg-[#2c2c38]','border','dark:border-[#353541]','dark:text-white','font-semibold','text-sm','rounded-lg','w-full','p-2.5','dark:placeholder-[#686872]','focus:outline-none', 'focus:border-[#635fc7]', 'focus:ring-1','focus:ring-[#635fc7]')
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
    if(id.includes('column')) {
        columns.push(id)
    }
}

const  modalBackground = (container) => {
    toggleBackground.removeAttribute('hidden');
    toggleBackground.addEventListener('click',(e) => {
        if (e.target.id === toggleBackground.id) {
            toggleBackground.setAttribute('hidden',true);
            container.remove();
        };
    });
    if (container.id.includes('column')) {
        columns = []
    }
};

// show the component
const showEditBoardMenu = () => {
    editBoardContainer.forEach(el => el.toggleAttribute('hidden'));
}
showEditBoardBtn.forEach(el => el.addEventListener('click',showEditBoardMenu));

const showEditBoard = () => {
    editBoardContainer.forEach(el => el.setAttribute('hidden',true));
    showAddNewColumn();
};

// show delete board modal
const showDeleteBoard = () => {
    const board = getBoard(appData.currentBoard)
    editBoardContainer.forEach(el => el.setAttribute('hidden',true));
    const container = createDeleteContainer("delete-board-container","Delete this board",`Are you Sure you want to delete the '${board.title}' board? This action will remove all columns and tasks and cannot be reversed.`,"delete-board-btn",'board');
    document.body.append(container);
    modalBackground(container);
};

// delete board function
const deleteBoard = (deleteContainer) => {
    const data = appData
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
        toggleBackground.setAttribute('hidden',true);
        deleteContainer.remove();
        showAlert('success')
    } else {
        // display error message
        toggleBackground.setAttribute('hidden',true);
        deleteContainer.remove();
        showAlert('error')
    }
}

// card component
const showCard = (e) => {
    let data = appData
    data.currentCard = e.target.id
    data.currentCol = e.path[1].id
    let card = getCardInfo()
    const [container,divCheckBoxEl] = createCardModal(card,data)
    updateSubTasks(divCheckBoxEl)
    document.body.append(container)
    modalBackground(container)
}

const updateSubTasks = (divCheckBoxEl) => {
    divCheckBoxEl.innerHTML = ''
    let card = getCardInfo()
    let length = card.subtasks.length
    let completedLength = card.subtasks.filter(task => task.isCompleted).length
    smallCardSubTasks = document.getElementById(card.id).children[1]
    smallCardSubTasks.textContent = `${completedLength} of ${length} subtasks`
    const label1 = document.createElement('label');
    label1.id = 'card-tasks-label';
    label1.className = 'block mb-1.5 text-sm font-medium text-[#828fa3] dark:text-white';
    label1.textContent = `Subtasks (${completedLength} of ${length})`
    divCheckBoxEl.appendChild(label1);
    card.subtasks.map((task) =>{
            let inputDiv = document.createElement('div')
            inputDiv.className = 'flex items-center px-3 rounded-lg bg-[#f4f7fd] dark:bg-[#21212d] my-2 hover:bg-[#635fc71a] dark:hover:bg-[#635fc71a] focus:outline-none focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7]'
            let inputEl = document.createElement('input')
            inputEl.className = 'w-[18px] h-[18px] accent-[#635fc7] text-blue-500 rounded-sm cursor-pointer'
            inputEl.setAttribute('type', 'checkbox')
            inputEl.setAttribute('id', task.id)
            inputEl.setAttribute('name', 'task-checkbox')
            task.isCompleted ? inputEl.setAttribute('checked',true) : '' 
            inputEl.addEventListener('change',()=> updateTask(task))
            let labelEl = document.createElement('label')
            labelEl.className = `py-4 ml-3 w-full text-[13px] font-bold dark:text-white cursor-pointer ${task.isCompleted ? 'line-through opacity-50' : ''}`
            labelEl.setAttribute('for', task.id)
            labelEl.textContent = task.title
            inputDiv.append(inputEl,labelEl)
            divCheckBoxEl.append(inputDiv)
        })
}

const updateTask = (task) => {
    const divCheckBoxEl = document.getElementById("card-checkbox")
    task.isCompleted = !task.isCompleted
    localStorage.setItem('app_data', JSON.stringify(appData))
    updateSubTasks(divCheckBoxEl)
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

// show the edit card component
const showEditCardMenu = () => {
    const editCardContainer = document.querySelector('#show-edit-card')
    editCardContainer.toggleAttribute('hidden')
}

// show delete Card modal
const showDeleteTask = () => {
    const card = getCardInfo()
    const cardContainer = document.querySelector('#card-modal')
    cardContainer.remove()
    const container = createDeleteContainer("delete-card-container","Delete this Task",`Are you sure you want to delete the '${card.title}' task and its subtasks? This action cannot be reversed.`,"delete-card-btn",'card')
    document.body.append(container)
    modalBackground(container)
}

// delete card function
const deleteTask = (deleteContainer) => {
    let data = appData
     // find the col index
    const cols = getCols()
    const colIndex = cols.findIndex(elem => elem.id === data.currentCol);
    // find the card index
    const cardIndex = cols[colIndex].cards.findIndex(c => c.id === data.currentCard);
    // splice it out
    cols[colIndex].cards.splice(cardIndex, 1);
    // save and initialize
    localStorage.setItem('app_data', JSON.stringify(appData));
    init()
    toggleBackground.setAttribute('hidden',true);
    deleteContainer.remove();
    showAlert('success')
}
// deleteCardBtn.addEventListener('click',deleteTask)

// show edit task
const showEditTask = () => {
    const cardContainer = document.querySelector('#card-modal')
    cardContainer.remove()
    // <-- create -->
    const container = createBaseContainer('edit-task-container')
    const innerContainer = createBaseInner('Edit Task')
    const form = createForm('edit-task-form')
    const formTitle = createFormTitle('Title','edit-title',false,true,'edit-task')
    const formDescription = createDescriptionForm('edit-description',false)
    const formFieldSet = createFieldSetFrom(false,'Subtasks','edit-subtask-container','add-new-edit-task-input','+ Add New SubTask','edit-task')
    const formStatus = createStatusFrom('edit-status')
    const formSubmitBtn = createSubmitBtnForm('Save')

    form.append(formTitle)
    form.append(formDescription)
    form.append(formFieldSet)
    form.append(formStatus)
    form.append(formSubmitBtn)
    form.addEventListener('submit', (e) => onEditTaskFormSubmit(e,form,container))

    innerContainer.append(form)
    container.append(innerContainer)
    document.body.append(container)
    modalBackground(container)
}

// add input element and append it to inputs container
const addEditTaskInput = (e,editTaskContainer) => {
    e.preventDefault()
    let divEl = createInput('','edit-subtask')
    editTaskContainer.append(divEl)
}

// // get the form data on submit
const onEditTaskFormSubmit = (e,form,container) => {
    // Prevent the default action (refreshing the page)
    e.preventDefault();
    let data = appData 
    // Get the form data
    const formData = new FormData(form);
    let card = getCardInfo()
    card.title = formData.get('edit-title')
    card.description = formData.get('edit-description')
    const nodelist = document.querySelectorAll('[name="edit-subtask-old"]')
    const array2 = Array.from(nodelist).map(node => node.parentNode.id);
    const array1 = card.subtasks.map(task => task.id)
    const result = array1.filter(id => !array2.includes(id));
    result.map(task => {
        const taskIndex = card.subtasks.findIndex(t => t.id === task)
        card.subtasks.splice(taskIndex, 1)
    })
    formData.getAll('edit-subtask-old').map((task,i) =>{
        card.subtasks[i].title = task
    })

    formData.getAll('edit-subtask').map((task) =>{
        if(task !== '') {
            card.subtasks.push(
                {
                    title: task,
                    isCompleted: false,
                    id: generateId('task')
                }
            )
        }
    })

    if(formData.get('edit-status') !== data.currentCol){
        let cols = getCols()
        const colIndex = cols.findIndex(col => col.id === data.currentCol)
        const cardIndex = cols[colIndex].cards.findIndex(card => card.id === data.currentCard)
        const removedCard = cols[colIndex].cards.splice(cardIndex, 1)[0];
        const newColIndex = cols.findIndex(col => col.id === formData.get('edit-status'))
        cols[newColIndex].cards.push(removedCard)
    }

    localStorage.setItem('app_data', JSON.stringify(appData));
    init()
    toggleBackground.setAttribute('hidden',true);
    container.remove();
};

/* <==============================================================================> */

const showAlert = (type) => {
    if (type === 'success') {
        const alert = document.createElement('div');
        alert.className = 'p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg w-[200px] absolute left-0 right-0 top-5 mx-auto'
        alert.innerHTML = '<span class="font-bold">Deleted successfully!</span>'
        document.body.append(alert);
        setTimeout(function() {
            document.body.removeChild(alert);
          }, 2000);
    } else {
        const alert = document.createElement('div');
        // Set the class and content of the element
        alert.className = 'p-4 text-sm text-red-700 bg-red-100 rounded-lg w-[300px] absolute left-0 right-0 top-5 mx-auto';
        alert.innerHTML = '<span class="font-bold">Error!</span> You must have at least one board.';
        // Add the element to the page
        document.body.append(alert);
        setTimeout(function() {
            document.body.removeChild(alert);
          }, 2000);
    }
}

const createBaseContainer = (id) => {
    const baseContainer = document.createElement('div');
    baseContainer.id = id;
    baseContainer.className = 'absolute top-0 bottom-0 left-0 right-0 m-auto w-11/12 sm:w-[500px] h-fit max-h-[80vh] md:max-h-[90vh] overflow-y-auto z-10 sm:scrollbar-thin scrollbar-thumb-[#655ec8] scrollbar-track-white dark:scrollbar-track-[#2c2c38] scrollbar-corner-white dark:scrollbar-corner-[#2c2c38]';
    return baseContainer
}

const createBaseInner = (heading) => {
    const baseInner = document.createElement('div');
    baseInner.className = 'p-7 bg-white dark:bg-[#2c2c38] rounded-lg';
    const baseHeading = document.createElement('h2');
    baseHeading.className = 'text-lg font-semibold dark:text-white';
    baseHeading.textContent = heading;
    baseInner.append(baseHeading);
    return baseInner
}

const createFormTitle = (content,id,placeholder,required,type) => {
    const titleDiv = document.createElement('div');
    const titleLabel = document.createElement('label');
    titleLabel.htmlFor = id;
    titleLabel.className = 'block mb-1.5 text-sm font-medium text-[#828fa3] dark:text-white';
    titleLabel.textContent = content;
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = id;
    titleInput.name = id;
    titleInput.className = 'dark:bg-[#2c2c38] border dark:border-[#353541] dark:text-white font-medium text-sm rounded-lg  w-full p-2.5 dark:placeholder-[#686872] focus:outline-none focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7]';
    if (type === 'column') {
        const board = getBoard(appData.currentBoard);
        titleInput.value = board.title;
    } else if (type === 'edit-task'){   
        const card = getCardInfo()
        titleInput.value = card.title;
    }
    placeholder ? titleInput.placeholder = 'e.g. Take coffee break' : '';
    required ? titleInput.required = true : '';
    titleDiv.appendChild(titleLabel);
    titleDiv.appendChild(titleInput);
    return titleDiv
}

const createForm = (id) => {
    const form = document.createElement('form');
    form.id = id;
    form.className = 'pt-5 space-y-5';
    return form
}

const createDescriptionForm = (id,placeholder) => {
    const descriptionDiv = document.createElement('div');
    const descriptionLabel = document.createElement('label');
    descriptionLabel.htmlFor = id;
    descriptionLabel.className = 'block mb-1.5 text-sm font-medium text-[#828fa3] dark:text-white';
    descriptionLabel.textContent = 'Description';
    const descriptionInput = document.createElement('textarea');
    descriptionInput.id = id;
    descriptionInput.name = id;
    descriptionInput.rows = 4;
    descriptionInput.className = 'block p-2.5 w-full text-sm dark:text-white font-medium dark:bg-[#2c2c38] rounded-lg border dark:border-[#353541] dark:placeholder-[#686872] focus:outline-none focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7]';
    if(placeholder) {
        descriptionInput.placeholder = 'e.g. It\'s always good to take a break, This 15 minutes break will recharge the batteries a little.'
    } else {
        const card = getCardInfo()
        descriptionInput.value = card.description
    }
    descriptionDiv.appendChild(descriptionLabel);
    descriptionDiv.appendChild(descriptionInput);
    return descriptionDiv
}

const createFieldSetFrom = (isPlaceHolder,legendText,id,btnId,btnContent,type) => {
    const types = {
        'task': addTaskInput,
        'column': addColumnInput,
        'board': addNewBoardColumnInput,
        'edit-task': addEditTaskInput,
    }
    const fieldset = document.createElement('fieldset');

    const legend = document.createElement('legend');
    legend.className = 'block mb-1.5 text-sm font-medium text-[#828fa3] dark:text-white';
    legend.textContent = legendText;

    const inputDiv = document.createElement('div');
    inputDiv.className = 'space-y-3';

    const inputContainer = document.createElement('div');
    inputContainer.id = id;
    inputContainer.className = 'space-y-3 !mb-3';
    let board = getBoard(appData.currentBoard)
    if (type === 'column') {
        board.cols.map(col => {
            divEl = createInput(col.title, 'column', col.id)
            inputContainer.append(divEl)
        })
    } else if (type === 'edit-task') {
        const card = getCardInfo()
        card.subtasks.map(task =>{
                divEl = createInput(task.title, 'edit-subtask-old', task.id)
                inputContainer.append(divEl)
            })
    }

    const addNewInput = document.createElement('button');
    addNewInput.id = btnId;
    addNewInput.className = 'py-3 px-5 bg-[#635fc71a] dark:bg-white text-[#655ec8] rounded-full font-bold w-full';
    addNewInput.textContent = btnContent;
    addNewInput.addEventListener('click', (e) => types[type](e,inputContainer))

    if (isPlaceHolder) {
        [subtask1Div,subtask2Div] = placeholder(type)
        inputDiv.appendChild(subtask1Div);
        inputDiv.appendChild(subtask2Div);
    }
    inputDiv.appendChild(inputContainer);

    fieldset.appendChild(legend);
    fieldset.appendChild(inputDiv);
    fieldset.appendChild(addNewInput);
    return fieldset;
}

const placeholder = (type) => {
    if (type === 'task') {
        const subtask1Div = document.createElement('div');
        subtask1Div.className = 'flex items-center gap-2.5';
        const subtask1Input = document.createElement('input');
        subtask1Input.type = 'text';
        subtask1Input.name = 'subtask';
        subtask1Input.className = 'dark:bg-[#2c2c38] border dark:border-[#353541] dark:text-white font-medium text-sm rounded-lg  w-full p-2.5 dark:placeholder-[#686872] focus:outline-none focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7]';
        subtask1Input.placeholder = 'e.g. Make coffee';
        subtask1Div.appendChild(subtask1Input);
        const subtask2Div = document.createElement('div');
        subtask2Div.className = 'flex items-center gap-2.5';
        const subtask2Input = document.createElement('input');
        subtask2Input.type = 'text';
        subtask2Input.name = 'subtask';
        subtask2Input.className = 'dark:bg-[#2c2c38] border dark:border-[#353541] dark:text-white font-medium text-sm rounded-lg  w-full p-2.5 dark:placeholder-[#686872] focus:outline-none focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7]';
        subtask2Input.placeholder = 'e.g. Drink coffee & smile';
        subtask2Div.appendChild(subtask2Input);
        return [subtask1Div,subtask2Div]
    } else {
        const div1 = document.createElement('div');
        div1.className = 'flex items-center gap-2.5';
        const input1 = document.createElement('input');
        input1.type = 'text';
        input1.name = 'new-board-column';
        input1.className = 'dark:bg-[#2c2c38] border dark:border-[#353541] dark:text-white font-medium text-sm rounded-lg w-full p-2.5 dark:placeholder-[#686872] focus:outline-none focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7]';
        input1.placeholder = 'e.g. Todo';
        div1.appendChild(input1);
        const div2 = document.createElement('div');
        div2.className = 'flex items-center gap-2.5';
        const input2 = document.createElement('input');
        input2.type = 'text';
        input2.name = 'new-board-column';
        input2.className = 'dark:bg-[#2c2c38] border dark:border-[#353541] dark:text-white font-medium text-sm rounded-lg w-full p-2.5 dark:placeholder-[#686872] focus:outline-none focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7]';
        input2.placeholder = 'e.g. Doing';
        div2.appendChild(input2);
        return [div1,div2]
    }
}

const createStatusFrom = (id) => {
    const statusDiv = document.createElement('div');

    const statusLabel = document.createElement('label');
    statusLabel.htmlFor = id;
    statusLabel.className = 'block mb-1.5 text-sm font-medium text-[#828fa3] dark:text-white';
    statusLabel.textContent = 'Status';

    const statusInput = document.createElement('select');
    statusInput.id = id;
    statusInput.name = id;
    statusInput.className = 'dark:bg-[#2c2c38] border dark:border-[#353541] dark:text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7]';
    const cols = getCols()
    const data = appData
    if (id === 'edit-status') {
        const defaultOption = document.createElement('option')
        defaultOption.value =  data.currentCol
        const defaultOptionTitle = cols.findIndex(col => col.id === data.currentCol)
        defaultOption.textContent = cols[defaultOptionTitle].title
        defaultOption.selected = true;
        statusInput.append(defaultOption)
            cols.map(col => {
                if (col.id !== defaultOption.value) {
                let optionEl = document.createElement('option')
                    optionEl.setAttribute('value', col.id)
                    optionEl.textContent = col.title
                    statusInput.append(optionEl)
                }
        })
    } else {
        cols.map(col => {
            let optionEl = document.createElement('option')
                optionEl.setAttribute('value', col.id)
                optionEl.textContent = col.title
                statusInput.append(optionEl)
        })
    }
    statusDiv.appendChild(statusLabel);
    statusDiv.appendChild(statusInput);
    return statusDiv
}

const createSubmitBtnForm = (content) => {
    const createButton = document.createElement('button');
    createButton.type = 'submit';
    createButton.className = 'py-3 px-5 bg-[#655ec8] hover:bg-[#a8a4ff] text-white rounded-full font-bold w-full mt-3';
    createButton.textContent = content;
    return  createButton
} 

const createDeleteContainer = (id,title,content,btnId,type) => {
    const deleteContainer = document.createElement('div');
    deleteContainer.id = id;
    deleteContainer.className = 'absolute top-0 bottom-0 left-0 right-0 m-auto w-11/12 sm:w-[500px] h-fit max-h-[80vh] md:max-h-[90vh] overflow-y-auto z-10';

    const innerDiv = document.createElement('div');
    innerDiv.className = 'p-7 bg-white dark:bg-[#2c2c38] rounded-lg';

    const h2 = document.createElement('h2');
    h2.className = 'text-lg font-semibold text-red-400 pb-7';
    h2.textContent = title;
    innerDiv.appendChild(h2);

    const p = document.createElement('p');
    p.className = 'text-sm text-[#828fa3] font-medium pb-6';
    p.textContent = content;
    innerDiv.appendChild(p);

    const deleteButton = document.createElement('button');
    deleteButton.id = btnId;
    deleteButton.className = 'py-3 px-5 bg-red-400 hover:bg-[#ff9898] text-white rounded-full font-semibold w-full mb-4';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click',() => type === 'board' ? deleteBoard(deleteContainer) : deleteTask(deleteContainer))
    innerDiv.appendChild(deleteButton);

    const cancelButton = document.createElement('button');
    cancelButton.className = 'py-3 px-5 text-[#655ec8] bg-[#635fc71a] dark:bg-white rounded-full font-semibold w-full';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click',() => {deleteContainer.remove(), toggleBackground.setAttribute('hidden',true)});
    innerDiv.appendChild(cancelButton);
    deleteContainer.appendChild(innerDiv);
    return deleteContainer;
}

const createCardModal = (card,data) => {
    const cardModal = document.createElement('div');
    cardModal.id = 'card-modal';
    cardModal.className = 'absolute top-0 bottom-0 left-0 right-0 m-auto w-11/12 sm:w-[500px] h-fit max-h-[80vh] md:max-h-[90vh] overflow-y-auto z-10 sm:scrollbar-thin scrollbar-thumb-[#655ec8] scrollbar-track-white dark:scrollbar-track-[#2c2c38] scrollbar-corner-white dark:scrollbar-corner-[#2c2c38]';
    const innerDiv = document.createElement('div');
    innerDiv.className = 'p-7 bg-white dark:bg-[#2c2c38] rounded-lg';
    const div1 = document.createElement('div');
    div1.className = 'flex items-center justify-between pb-5 relative';
    const h2 = document.createElement('h2');
    h2.id = 'card-title';
    h2.className = 'text-lg font-semibold dark:text-white';
    h2.textContent = card.title;
    div1.appendChild(h2);

    const span = document.createElement('span');
    span.className = 'text-[#828fa3] cursor-pointer';
    span.id = 'edit-card-btn';
    span.addEventListener('click',showEditCardMenu) 

    span.innerHTML = 
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z">
        </path>
    </svg>`
    div1.appendChild(span);

    const showEditCard = document.createElement('div');
    showEditCard.id = 'show-edit-card';
    showEditCard.className = 'w-36 h-24 bg-white dark:bg-[#21212d] absolute -bottom-[76px] -right-7 rounded-lg py-3 px-5 z-10';
    showEditCard.hidden = true;
    const ul = document.createElement('ul');
    ul.className = ' w-full h-full flex flex-col justify-between';
    const li1 = document.createElement('li');
    li1.className = 'text-[#828fa3] text-sm font-bold cursor-pointer';
    li1.textContent = 'Edit Task';
    li1.addEventListener('click', showEditTask);
    const li2 = document.createElement('li');
    li2.className = 'text-red-400 text-sm font-bold cursor-pointer';
    li2.textContent = 'Delete Task';
    li2.addEventListener('click', showDeleteTask);
    ul.appendChild(li1);
    ul.appendChild(li2);
    showEditCard.appendChild(ul);
    div1.appendChild(showEditCard);
    innerDiv.appendChild(div1);

    const p = document.createElement('p');
    p.id = 'card-description';
    p.className = 'text-[#828fa3] text-[13px] font-medium leading-relaxed pb-5';
    p.textContent = card.description;
    innerDiv.appendChild(p);

    const div2 = document.createElement('div');
    div2.id = 'card-checkbox';
    innerDiv.appendChild(div2);

    const div3 = document.createElement('div');
    const label2 = document.createElement('label');
    label2.className = 'block mb-1.5 text-sm font-medium text-[#828fa3] dark:text-white pt-5';
    label2.textContent = 'Status';
    div3.appendChild(label2);

    const select = document.createElement('select');
    select.id = 'card-status-select';
    select.className = 'dark:bg-[#2c2c38] border dark:border-[#353541] dark:text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-[#635fc7] focus:ring-1 focus:ring-[#635fc7]';
    select.name = 'card-status';
    let cols = getCols()
    const defaultOption = document.createElement('option')
    defaultOption.value =  data.currentCol
    const defaultOptionTitle = cols.findIndex(col => col.id === data.currentCol)
    defaultOption.textContent = cols[defaultOptionTitle].title
    defaultOption.selected = true;
    select.append(defaultOption)
        cols.map(col => {
            if (col.id !== defaultOption.value) {
            let optionEl = document.createElement('option')
                optionEl.setAttribute('value', col.id)
                optionEl.textContent = col.title
                select.append(optionEl)
            }
        })
    select.addEventListener('change',(e)=>updateCardStatus(e))
    div3.appendChild(select);
    innerDiv.appendChild(div3);
    cardModal.appendChild(innerDiv);
    return [cardModal,div2]
}

const createMobileBoardMenu = () => {
const data = appData
    const MobileBoardContainer = document.createElement('div');
    MobileBoardContainer.id = 'board-container-mobile';
    MobileBoardContainer.className = 'absolute top-0 bottom-0 left-0 right-0 m-auto w-64 h-fit max-h-[80vh] md:max-h-[90vh] overflow-y-auto z-10 sm:scrollbar-thin scrollbar-thumb-[#655ec8] scrollbar-track-white dark:scrollbar-track-[#2c2c38] scrollbar-corner-white dark:scrollbar-corner-[#2c2c38]';
    const innerDiv = document.createElement('div');
    innerDiv.className = 'p-5 pl-0 bg-white dark:bg-[#2c2c38] rounded-lg';
    const p = document.createElement('p');
    p.className = 'uppercase font-bold text-xs text-[#828fa3] tracking-wide pl-5 all-boards-title mb-3';
    p.textContent = `All Boards (${data.boards.length})`
    innerDiv.append(p)
    data.boards.map((board) => {
        let boardSelection = document.createElement('div')
            boardSelection.setAttribute('id',board.id)
            boardSelection.onclick = () => {
                changeBoard(board.id)
                toggleBackground.setAttribute('hidden',true)
                MobileBoardContainer.remove()
            }
            boardSelection.className = `${data.currentBoard === board.id ? 'bg-[#635fc7] text-white fill-white' : 'bg-transparent text-[#828fa3] fill-[#828fa3]'} text-base font-semibold pl-5 py-3 rounded-r-full hover:bg-[#635fc71a] hover:text-[#635fc7] cursor-pointer gap-4 flex items-center hover:fill-[#635fc7]`
            svgDiv = document.createElement('div')
            svgDiv.innerHTML = '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"></path></svg>'
            spanEl = document.createElement('span')
            spanEl.textContent = board.title
            boardSelection.append(svgDiv,spanEl)
            innerDiv.append(boardSelection)
    })
    const addBoardBtn = document.createElement('div');
    addBoardBtn.onclick = () => {
        showAddNewBoard()
        MobileBoardContainer.remove()
    }
    addBoardBtn.id = 'add-board-btn-mobile';
    addBoardBtn.className = 'text-base font-semibold pl-5 py-3 rounded-r-full hover:bg-[#635fc71a] text-[#635fc7] cursor-pointer gap-4 flex items-center fill-[#635fc7] mt-3';
    addBoardBtn.innerHTML = '<div><svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"></path></svg></div><span>+ Create New Board</span>';
    const themeDiv = document.createElement('div');
    themeDiv.className ='mt-3'
    const themeInnerDiv = document.createElement('div');
    themeInnerDiv.classList.add('p-2.5','ml-5','bg-[#f4f7fd]', 'dark:bg-[#21212d]', 'rounded-md');
    themeInnerDiv.innerHTML = `<div class="flex justify-center gap-5">
                                <!-- svg -->
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#828fa3" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                                <!-- toggle -->
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox"  class="sr-only peer toggle-element" id="toggle-theme-mobile">
                                    <div class="w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#635fc7]"></div>
                                </label>
                                <!-- svg -->
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#828fa3" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            </div>`
    themeDiv.appendChild(themeInnerDiv);
    innerDiv.append(addBoardBtn);
    innerDiv.append(themeDiv);
    MobileBoardContainer.append(innerDiv);
    document.body.append(MobileBoardContainer);
    // set up toggle position
    toggleThemeMobile = document.getElementById('toggle-theme-mobile')
    toggleThemeMobile.checked = data.theme === 'dark' ? true : false;
    modalBackground(MobileBoardContainer)
}
mobileBoardMenu.addEventListener('click',createMobileBoardMenu)

// theme change events
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-element')) {
        const html = document.querySelector('html')
        html.classList.toggle('dark')
        appData.theme = html.className
        localStorage.setItem('app_data', JSON.stringify(appData))
    }
});
document.addEventListener('change', () => {
    if (document.querySelector('html').className === 'dark') {
        toggleThemeBtn.checked = true
    } else {
        toggleThemeBtn.checked = false
    }
});


// horizontal scroll on drag
const slider = document.querySelector('#board-container');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
if (e.target.id.includes('card')) return
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
});