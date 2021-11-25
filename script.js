const START_POSITION = {
    pieces: ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'rook', 'rook', 'knight', 'knight', 'bishop', 'bishop', 'queen', 'king'],
    topCoords: ['17', '27', '37', '47', '57', '67', '77', '87', '18', '88', '28', '78', '38', '68', '48', '58'],
    bottomCoords: ['12', '22', '32', '42', '52', '62', '72', '82', '11', '81', '21', '71', '31', '61', '41', '51'],
}

const board = document.getElementById('board')


board.addEventListener('touchmove', (e) => {
    e.preventDefault()
    if (!e.x) {
      e.x = e.touches[0].clientX
      e.y = e.touches[0].clientY
    }
    const el = document.querySelector('.dragging')
    if (el) {
        const boardBox = board.getBoundingClientRect()
        el.style.setProperty('--x', e.x - boardBox.x)
        el.style.setProperty('--y', e.y - boardBox.y)
    }
})

board.addEventListener('touchstart', (e) =>{
  if (!e.x) {
    e.x = e.touches[0].clientX
    e.y = e.touches[0].clientY
  }
  const selectedPiece = document.querySelector('.selected')
  if(!selectedPiece) return
  const cssCoord = mouseToCssBoardCoord({x: e.x, y: e.y})
  const p = pieces.find(p => p.element === selectedPiece)
  p.coord = cssCoord
  document.querySelectorAll('.selected').forEach(el => {
    el.classList.remove('selected')
  })
})

const pieces = []
let virtualPieces = []

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
            type: START_POSITION.pieces[i % 16],
            set coord(c) {
                this.element.setAttribute('data-coord', c)
            },
            get coord() {
                return this.element.getAttribute('data-coord')
            }
        })
    }
    //console.log(pieces)
    virtualPieces = pieces.map(p => ({coord: p.coord, color: p.color, type: p.type}))
    //console.log(virtualPieces)
    //console.log(pieces)
}

const drawPieces = (indexToRemove) => {
  if(indexToRemove != -1){
    board.removeChild(pieces[indexToRemove].element)
    pieces.splice(indexToRemove, 1)
  }
  console.log(pieces.length, virtualPieces.length)
  pieces.forEach((p, i) => {
    p.coord = virtualPieces[i].coord
  })
}

const removePiece = (i) => {
  
}

const setPieceListeners = ()=>{
    pieces.forEach((p, i) => {
        let startDraggTime
        p.element.addEventListener('touchstart', (e) => {
            e.stopPropagation()
            if(!e.x){
              e.x = e.touches[0].clientX
              e.y = e.touches[0].clientY
            }
            
            document.querySelectorAll('.selected').forEach(el => {
                    if (p.element !== el) el.classList.remove('selected')
                })
            startDraggTime = new Date().getTime()
            p.element.classList.add('dragging')
            p.element.classList.toggle('selected')
            const boardBox = board.getBoundingClientRect()
            p.element.style.setProperty('--x', e.x - boardBox.x)
            p.element.style.setProperty('--y', e.y - boardBox.y)
        })
        p.element.addEventListener('touchend', (e) => {
            
            if(!e.x){
              e.x = e.changedTouches[0].clientX
              e.y = e.changedTouches[0].clientY
            }
            
            const diff = new Date().getTime() - startDraggTime
            if (diff > 130) p.element.classList.remove('selected')
            p.element.classList.remove('dragging')

            
            const cssCoord = mouseToCssBoardCoord({x: e.x,  y: e.y})
            
            const indexToRemove = virtualPieces.findIndex(p => p.coord === cssCoord)
            virtualPieces[i].coord = cssCoord
            if(indexToRemove != -1){
              virtualPieces.splice(indexToRemove, 1)
            }
            
            
            drawPieces(indexToRemove)
            //p.coord = cssCoord
        })
    })
}

const mouseToCssBoardCoord = ({x, y}) => {
  const boardBox = board.getBoundingClientRect()
  const _x = Math.ceil((x - boardBox.x) / boardBox.width * 8).toString()
  const _y = Math.ceil(8-(y - boardBox.y) / boardBox.height * 8).toString()
  return _x + _y
}


setStartPosition()
setPieceListeners()