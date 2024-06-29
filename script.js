const grid = document.querySelector('.grid');
const title = document.querySelector('#title');
const emojis = ['🍎', '🍊', '🍇', '🍒', '🍍', '🍉']; // Add more emojis as needed
const width = 9;
const cells = [];
let score = 0;

// Create the board
function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('draggable', true);
        cell.setAttribute('id', i);
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        cell.innerHTML = randomEmoji;
        grid.appendChild(cell);
        cells.push(cell);
    }
}

function resetBoard() {
    grid.innerHTML = '';
    cells.length = 0;
    createBoard();
    score = 0;
    document.getElementById('score').innerText = score;
}

createBoard();

title.addEventListener('click', resetBoard);

let emojiBeingDragged;
let emojiBeingReplaced;
let cellIdBeingDragged;
let cellIdBeingReplaced;

cells.forEach(cell => cell.addEventListener('dragstart', dragStart));
cells.forEach(cell => cell.addEventListener('dragend', dragEnd));
cells.forEach(cell => cell.addEventListener('dragover', dragOver));
cells.forEach(cell => cell.addEventListener('dragenter', dragEnter));
cells.forEach(cell => cell.addEventListener('dragleave', dragLeave));
cells.forEach(cell => cell.addEventListener('drop', dragDrop));

function dragStart() {
    emojiBeingDragged = this.innerHTML;
    cellIdBeingDragged = parseInt(this.id);
}

function dragEnd() {
    let validMoves = [cellIdBeingDragged - 1, cellIdBeingDragged + 1, cellIdBeingDragged - width, cellIdBeingDragged + width];
    let validMove = validMoves.includes(cellIdBeingReplaced);

    if (cellIdBeingReplaced && validMove) {
        cellIdBeingReplaced = null;
        checkMatches();
    } else if (cellIdBeingReplaced && !validMove) {
        cells[cellIdBeingReplaced].innerHTML = emojiBeingReplaced;
        cells[cellIdBeingDragged].innerHTML = emojiBeingDragged;
    } else cells[cellIdBeingDragged].innerHTML = emojiBeingDragged;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    emojiBeingReplaced = this.innerHTML;
    cellIdBeingReplaced = parseInt(this.id);
    cells[cellIdBeingDragged].innerHTML = emojiBeingReplaced;
    cells[cellIdBeingReplaced].innerHTML = emojiBeingDragged;
}

// Check for matches
function checkMatches() {
    // Check for row matches
    for (let i = 0; i < width * width; i++) {
        let row = [i, i + 1, i + 2];
        let decidedEmoji = cells[i].innerHTML;
        const isBlank = cells[i].innerHTML === '';

        if (i % width < width - 2) {
            if (row.every(index => cells[index].innerHTML === decidedEmoji && !isBlank)) {
                row.forEach(index => {
                    cells[index].innerHTML = '';
                    score += 10;
                    document.getElementById('score').innerText = score;
                });
            }
        }
    }

    // Check for column matches
    for (let i = 0; i < width * (width - 2); i++) {
        let column = [i, i + width, i + width * 2];
        let decidedEmoji = cells[i].innerHTML;
        const isBlank = cells[i].innerHTML === '';

        if (column.every(index => cells[index].innerHTML === decidedEmoji && !isBlank)) {
            column.forEach(index => {
                cells[index].innerHTML = '';
                score += 10;
                document.getElementById('score').innerText = score;
            });
        }
    }

    // Drop emojis to fill empty spaces
    for (let i = 0; i < width * width - width; i++) {
        if (cells[i + width].innerHTML === '') {
            cells[i + width].innerHTML = cells[i].innerHTML;
            cells[i].innerHTML = '';
            const firstRow = Array.from({ length: width }, (_, index) => index);
            firstRow.forEach(index => {
                if (cells[index].innerHTML === '') {
                    let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    cells[index].innerHTML = randomEmoji;
                }
            });
        }
    }
}

// Continuously check for matches
window.setInterval(function() {
    checkMatches();
}, 100);

