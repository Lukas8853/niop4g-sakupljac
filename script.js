const gridContainer = document.getElementById('grid');
let currentPlayer = 1;
let player1Name = '';
let player2Name = '';
let phase = 'place';
let lastPlaces = null;
let gameState = [];

document.getElementById('start-btn').addEventListener('click', function () {
    player1Name = document.getElementById('player1-name').value;
    player2Name = document.getElementById('player2-name').value;
    document.getElementById('game').style.display = 'block';
    startGame();
    updateStatus();
});

document.getElementById('reset-btn').addEventListener('click', function () {
    location.reload();
});

function updateStatus() {
    let name = currentPlayer === 1 ? player1Name : player2Name;
    let color = currentPlayer === 1 ? 'red' : 'blue';
    document.getElementById('status').textContent = `${name}'s turn`;
    document.getElementById('status').style.color = color;
}

function startGame() {
    for (let i = 0; i < 6; i++) {
        let row = [];
        for (let j = 0; j < 6; j++) {
            let cell = document.createElement('div');
            cell.style.width = '100px';
            cell.style.height = '100px';
            cell.style.outline = '1px solid black';
            cell.style.backgroundColor = 'white';
            cell.style.display = 'flex';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            gridContainer.appendChild(cell);
            row.push({ player: null, eliminated: false });
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', function () {
                let row = this.dataset.row;
                let col = this.dataset.col;
                if (gameState[row][col].player === null && !gameState[row][col].eliminated) {
                    if (phase === 'place') {
                        if (adjecentCells(row, col)) {
                            gameState[row][col].player = currentPlayer;
                            let dot = document.createElement('div');
                            dot.style.width = '30px';
                            dot.style.height = '30px';
                            dot.style.borderRadius = '50%';
                            dot.style.backgroundColor = currentPlayer === 1 ? 'red' : 'blue';
                            this.appendChild(dot);
                            phase = 'eliminate';
                            lastPlaces = { row: row, col: col };
                        }
                        else {
                            alert('Invalid placment');
                            return;
                        }
                    } else if (phase === 'eliminate') {
                        let rowDiff = Math.abs(row - lastPlaces.row);
                        let colDiff = Math.abs(col - lastPlaces.col);
                        if (rowDiff > 1 || colDiff > 1 || (rowDiff === 0 && colDiff === 0)) {
                            alert('You must shadow an adjacent cell!');
                            return;
                        }
                        gameState[row][col].eliminated = true;
                        this.style.backgroundColor = 'gray';
                        phase = 'place';
                        currentPlayer = currentPlayer === 1 ? 2 : 1;
                        updateStatus();
                        updateScore();
                        checkGameOver();
                    }
                }
            })
        }
        gameState.push(row);
    }
}

function updateScore() {
    let p1 = getBiggestGroup(1);
    let p2 = getBiggestGroup(2);
    document.getElementById('score').textContent = `${player1Name}: ${p1} | ${player2Name}: ${p2}`;
}

function getBiggestGroup(player) {
    let visited = [];
    for (let i = 0; i < 6; i++) {
        let row = [];
        for (let j = 0; j < 6; j++) {
            row.push(false);
        }
        visited.push(row);
    }
    let biggest = 0;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (gameState[i][j].player === player && !visited[i][j]) {
                let groupSize = dfs(i, j, player, visited);
                if (groupSize > biggest) {
                    biggest = groupSize;
                }
            }
        }
    }
    return biggest;
}

function dfs(row, col, player, visited) {
    if (row < 0 || row >= 6 || col < 0 || col >= 6) return 0;
    if (visited[row][col]) return 0;
    if (player === 1 && gameState[row][col].player !== 1) return 0;
    else if (player === 2 && gameState[row][col].player !== 2) return 0;
    visited[row][col] = true;
    let count = 1;
    count += dfs(row - 1, col, player, visited);
    count += dfs(row + 1, col, player, visited);
    count += dfs(row, col - 1, player, visited);
    count += dfs(row, col + 1, player, visited);
    count += dfs(row - 1, col - 1, player, visited);
    count += dfs(row - 1, col + 1, player, visited);
    count += dfs(row + 1, col - 1, player, visited);
    count += dfs(row + 1, col + 1, player, visited);
    return count;
}

function checkGameOver() {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if ((gameState[i][j].player === null && !gameState[i][j].eliminated) && adjecentCells(i, j)) {
                return false;
            }
        }
    }
    let p1 = getBiggestGroup(1);
    let p2 = getBiggestGroup(2);
    if (p1 === p2) {
        document.getElementById('status').textContent = "Game Over! It's a tie!";
    }
    else if (p1 > p2) {
        document.getElementById('status').textContent = `Game Over! Winner: ${player1Name}`;
    }
    else {
        document.getElementById('status').textContent = `Game Over! Winner: ${player2Name}`;
    }
    setTimeout(() => {
        location.reload();
    }, 10000);
}

function adjecentCells(row, col) {
    let cells = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let newRow = parseInt(row) + i;
            let newCol = parseInt(col) + j;
            if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 6) {
                if (gameState[newRow][newCol].player === null && !gameState[newRow][newCol].eliminated) {
                    return true;
                }
            }
        }
    }
    return false;
}