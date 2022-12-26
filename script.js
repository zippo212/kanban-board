let appData = {
    boards: [
        {
            title: 'Board-1',
            id: 'b1',
            cols: [
                {
                    title: 'Todo',
                    id: 'c1',
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
    let currentBoard = getBoard(data.currentBoard)
    var drake = dragula(currentBoard.cols.map(col => document.getElementById(col.title), { revertOnSpill: true }));
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
    let currentBoard = getBoard(data.currentBoard)
    console.log(currentBoard)
    // create column
    currentBoard.cols.map(column => {
        // create column container
        let columnSection = document.createElement('section')
        columnSection.classList.add('w-72', 'h-full')
        // create column title
        let columnTitle = document.createElement('h2')
        columnTitle.classList.add('uppercase', 'flex', 'items-center')
        // create title content *Fix dot color later and number in ()* 
        let columnTitleDot = document.createElement('span')
        columnTitleDot.classList.add('h-3', 'w-3', 'block', 'bg-teal-300', 'rounded-full', 'mr-3')
        let columnTitleSpan = document.createElement('span')
        columnTitleSpan.classList.add('block')
        columnTitleSpan.textContent = column.title + ' ' + '(4)'
        // create card container
        let cardContainer = document.createElement('div')
        cardContainer.classList.add('w-72', 'pt-5', 'space-y-4')
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
