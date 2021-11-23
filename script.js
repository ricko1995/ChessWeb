const START_POSITION = {
    pieces: ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'rook', 'rook', 'knight', 'knight', 'bishop', 'bishop', 'queen', 'king'],
    topCoords: ['17', '27', '37', '47', '57', '67', '77', '87', '18', '88', '28', '78', '38', '68', '48', '58'],
    bottomCoords: ['12', '22', '32', '42', '52', '62', '72', '82', '11', '81', '21', '71', '31', '61', '41', '51'],
}

const board = document.getElementById('board')

board.addEventListener('mousemove', (e) => {
    e.preventDefault()
    const el = document.querySelector('.dragging')
    if (el) {
        const boardBox = board.getBoundingClientRect()
        el.style.setProperty('--x', e.x - boardBox.x)
        el.style.setProperty('--y', e.y - boardBox.y)
    }
})

const pieces = []

const setStartPosition = () => {
    board.innerHTML = ''
    for (let i = 0; i < START_POSITION.pieces.length * 2; i++) {
        const piece = document.createElement('div')
        piece.classList.add('piece', i < 16 ? 'white' : 'black', START_POSITION.pieces[i % 16])
        piece.setAttribute('data-coord', i < 16 ? START_POSITION.bottomCoords[i] : START_POSITION.topCoords[i % 16])
        piece.setAttribute('draggable', true)

        board.appendChild(piece)

        pieces.push({
            element: piece,
            color: i < 16 ? 'white' : 'black',
            set coord(c) {
                this.element.setAttribute('data-coord', c)
            },
            get coord() {
                return this.element.getAttribute('data-coord')
            }
        })
    }
}

const setPieceListeners = ()=>{
    pieces.forEach(p => {
        let startDraggTime
        p.element.addEventListener('mousedown', (e) => {
            [...document.querySelectorAll('.selected')].forEach(el => {
                if (p.element !== el) el.classList.remove('selected')
            })
            startDraggTime = new Date().getTime()
            p.element.classList.add('dragging')
            p.element.classList.toggle('selected')
            const boardBox = board.getBoundingClientRect()
            p.element.style.setProperty('--x', e.x - boardBox.x)
            p.element.style.setProperty('--y', e.y - boardBox.y)
        })
        p.element.addEventListener('mouseup', (e) => {
            const diff = new Date().getTime() - startDraggTime
            if (diff > 130) p.element.classList.remove('selected')
            p.element.classList.remove('dragging')

            const boardBox = board.getBoundingClientRect()
            const x = Math.ceil((e.x - boardBox.x) / boardBox.width * 8).toString()
            const y = (9 - Math.ceil((e.y - boardBox.y) / boardBox.height * 8)).toString()
            p.coord = x + y
        })
    })
}


setStartPosition()
setPieceListeners()