const appData = {
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
                            title: 'first second col',
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
    currentBoard: 0,
    currentCol: 0,
    currentCard: 0,
    settings: null
}

function init() {
    if(!localStorage.getItem('app_data')) {
        localStorage.setItem('app_data', JSON.stringify(appData))
    }
    data = JSON.parse(localStorage.getItem('app_data'))
    console.log(data)
    fillData(data)
    var drake = dragula([document.getElementById('left'), document.getElementById('right')], { revertOnSpill: true });
}

document.body.onload = () => init()

const boardContainer = document.querySelector('#board')
const fillData = (data) => {
    console.log(data.boards[data.currentBoard].cols)
    // create column
    data.boards[data.currentBoard].cols.map(column => {
        let columnSection = document.createElement('section')
        columnSection.classList.add('w-72','h-full')
    })
}
