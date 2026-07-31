const COLS = 10;
const ROWS = 20;
const BLOCK = 30;

const boardCanvas = document.getElementById("board");
const ctx = boardCanvas.getContext("2d");

const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");

ctx.scale(BLOCK, BLOCK);
nextCtx.scale(30, 30);

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const overlay = document.getElementById("overlay");

const COLORS = [
    null,
    "#00FFFF",
    "#0066FF",
    "#FF9900",
    "#FFFF00",
    "#00FF66",
    "#AA00FF",
    "#FF3333"
];

const arena = createMatrix(COLS, ROWS);

const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0
};

const levelEl =
document.getElementById("level");

let nextPiece = null;
let animationId = null;
let paused = false;
let gameStarted = false;

let dropCounter = 0;
let dropInterval = 700;
let lastTime = 0;

const holdCanvas = document.getElementById("hold");
const holdCtx = holdCanvas.getContext("2d");
holdCtx.scale(30, 30);

const highScore =
    localStorage.getItem("tetris-highscore") || 0;

highScoreEl.textContent = highScore;

const comboEl =
document.getElementById("combo");

function createMatrix(w, h) {
    const matrix = [];

    while (h--) {
        matrix.push(new Array(w).fill(0));
    }

    return matrix;
}

function createPiece(type) {

    if (type === "T") {
        return [
            [0,6,0],
            [6,6,6],
            [0,0,0]
        ];
    }

    if (type === "O") {
        return [
            [4,4],
            [4,4]
        ];
    }

    if (type === "L") {
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3]
        ];
    }

    if (type === "J") {
        return [
            [0,2,0],
            [0,2,0],
            [2,2,0]
        ];
    }

    if (type === "I") {
        return [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ];
    }

    if (type === "S") {
        return [
            [0,5,5],
            [5,5,0],
            [0,0,0]
        ];
    }

    if (type === "Z") {
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0]
        ];
    }
}

function randomPiece() {

    const pieces = "TJLOSZI";

    return createPiece(
        pieces[
            Math.floor(
                Math.random() * pieces.length
            )
        ]
    );
}

function drawCell(x, y, color) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.fillRect(
        x,
        y,
        1,
        1
    );

    ctx.shadowBlur = 0;
    ctx.strokeStyle =
        "rgba(255,255,255,.15)";
    ctx.strokeRect(
        x,
        y,
        1,
        1
    );
}

function drawMatrix(matrix, offset) {

    matrix.forEach((row, y) => {

        row.forEach((value, x) => {

            if (value !== 0) {

                drawCell(
                    x + offset.x,
                    y + offset.y,
                    COLORS[value]
                );

            }

        });

    });

}

function drawArena() {

    arena.forEach((row, y) => {

        row.forEach((value, x) => {

            if (value !== 0) {

                drawCell(
                    x,
                    y,
                    COLORS[value]
                );

            }

        });

    });

}

function draw() {

    ctx.fillStyle = "#020617";
    ctx.fillRect(
        0,
        0,
        boardCanvas.width,
        boardCanvas.height
    );

    drawArena();
    drawMatrix(player.matrix, player.pos);
}

function drawNextPiece() {

    nextCtx.clearRect(
        0,
        0,
        nextCanvas.width,
        nextCanvas.height
    );

    if (!nextPiece) return;

    nextPiece.forEach((row, y) => {

        row.forEach((value, x) => {

            if (value !== 0) {

                nextCtx.fillStyle =
                    COLORS[value];

                nextCtx.fillRect(
                    x + 0.5,
                    y + 0.5,
                    1,
                    1
                );

            }

        });

    });

}

function collide(arena, player) {

    const m = player.matrix;
    const o = player.pos;

    for (let y = 0; y < m.length; y++) {

        for (let x = 0; x < m[y].length; x++) {

            if (
                m[y][x] !== 0 &&
                (
                    arena[y + o.y] &&
                    arena[y + o.y][x + o.x]
                ) !== 0
            ) {
                return true;
            }

        }

    }

    return false;
}

function merge(arena, player) {

    player.matrix.forEach((row, y) => {

        row.forEach((value, x) => {

            if (value !== 0) {

                arena[y + player.pos.y]
                [x + player.pos.x] = value;

            }

        });

    });

}

function arenaSweep() {

    let lines = 0;

    outer:
    for (
        let y = arena.length - 1;
        y >= 0;
        y--
    ) {

        for (
            let x = 0;
            x < arena[y].length;
            x++
        ) {

            if (arena[y][x] === 0) {
                continue outer;
            }

        }

        const row =
            arena.splice(y, 1)[0].fill(0);

        arena.unshift(row);

        lines++;
        y++;

    }

    if (lines > 0) {

        totalLines += lines;

        player.score += lines * 100 * level;

        level =
            Math.floor(totalLines / 10) + 1;

        levelEl.textContent = level;

        dropInterval =
            Math.max(
                100,
                700 - ((level - 1) * 50)
            );

        updateScore();
    }

    if(lines > 0){
        combo++;

        comboEl.textContent =
            combo + "x";

        player.score +=
            lines * 100 * level +
            combo * 50;

    }else{
        combo = 0;
        comboEl.textContent = "0";
    }
}

function rotate(matrix) {

    for (
        let y = 0;
        y < matrix.length;
        y++
    ) {

        for (
            let x = 0;
            x < y;
            x++
        ) {

            [
                matrix[x][y],
                matrix[y][x]
            ] = [
                matrix[y][x],
                matrix[x][y]
            ];

        }

    }

    matrix.forEach(row => row.reverse());
}

function playerRotate() {

    const pos = player.pos.x;

    let offset = 1;

    rotate(player.matrix);

    while (collide(arena, player)) {

        player.pos.x += offset;

        offset =
            -(offset + (offset > 0 ? 1 : -1));

        if (
            offset >
            player.matrix[0].length
        ) {

            rotate(player.matrix);
            rotate(player.matrix);
            rotate(player.matrix);

            player.pos.x = pos;

            return;
        }

    }

}

function playerMove(dir) {

    player.pos.x += dir;

    if (collide(arena, player)) {
        player.pos.x -= dir;
    }

}

function playerDrop() {

    player.pos.y++;

    if (collide(arena, player)) {

        player.pos.y--;

        merge(arena, player);

        arenaSweep();

        playerReset();

    }

    dropCounter = 0;
}

function playerReset() {

    if (!nextPiece) {
        nextPiece = randomPiece();
    }

    player.matrix = nextPiece;
    nextPiece = randomPiece();

    drawNextPiece();

    player.pos.y = 0;

    player.pos.x =
        Math.floor(
            COLS / 2 -
            player.matrix[0].length / 2
        );

    if (collide(arena, player)) {

        gameOver();

    }

}

function updateScore() {

    scoreEl.textContent =
        player.score;

}

function update(time = 0) {

    if (paused) return;

    const delta = time - lastTime;
    lastTime = time;

    dropCounter += delta;

    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();

    animationId =
        requestAnimationFrame(update);
}

function resetGame() {

    arena.forEach(row =>
        row.fill(0)
    );

    player.score = 0;

    updateScore();

    nextPiece = randomPiece();

    playerReset();

    draw();
}

function startGame() {

    resetGame();

    overlay.classList.add("hidden");

    paused = false;

    gameStarted = true;

    cancelAnimationFrame(animationId);

    update();
}

function gameOver() {

    cancelAnimationFrame(animationId);

    overlay.classList.remove("hidden");

    overlay.querySelector("h2")
        .textContent = "GAME OVER";

    overlay.querySelector("p")
        .textContent =
        `Final Score: ${player.score}`;

    gameStarted = false;
}

function drawHoldPiece() {

    holdCtx.clearRect(
        0,
        0,
        holdCanvas.width,
        holdCanvas.height
    );

    if (!holdPiece) return;

    holdPiece.forEach((row, y) => {
        row.forEach((value, x) => {

            if (value !== 0) {

                holdCtx.fillStyle =
                    COLORS[value];

                holdCtx.fillRect(
                    x + 0.5,
                    y + 0.5,
                    1,
                    1
                );
            }
        });
    });
}

function holdCurrentPiece() {

    if (!canHold) return;

    if (!holdPiece) {

        holdPiece = player.matrix;
        playerReset();

    } else {

        const temp = holdPiece;
        holdPiece = player.matrix;
        player.matrix = temp;

        player.pos.y = 0;
        player.pos.x = 3;
    }

    drawHoldPiece();

    canHold = false;
}

canHold = true;

case "c":
case "C":
    holdCurrentPiece();
    break;

startBtn.addEventListener(
    "click",
    startGame
);

pauseBtn.addEventListener(
    "click",
    () => {

        if (!gameStarted) return;

        paused = !paused;

        pauseBtn.textContent =
            paused ? "Resume" : "Pause";

        if (!paused) {
            update();
        }

    }
);

document.addEventListener(
    "keydown",
    e => {

        if (!gameStarted) return;

        if (paused) return;

        switch (e.key) {

            case "ArrowLeft":
                playerMove(-1);
                break;

            case "ArrowRight":
                playerMove(1);
                break;

            case "ArrowDown":
                playerDrop();
                break;

            case "ArrowUp":
                playerRotate();
                break;

            case " ":
                while (
                    !collide(arena, player)
                ) {
                    player.pos.y++;
                }

                player.pos.y--;
                playerDrop();
                break;
        }

    }
);

function drawGhost() {

    const ghost = {
        pos: {
            x: player.pos.x,
            y: player.pos.y
        },
        matrix: player.matrix
    };

    while (!collide(arena, ghost)) {
        ghost.pos.y++;
    }

    ghost.pos.y--;

    ghost.matrix.forEach((row, y) => {

        row.forEach((value, x) => {

            if (value !== 0) {

                ctx.fillStyle =
                    "rgba(255,255,255,.15)";

                ctx.fillRect(
                    x + ghost.pos.x,
                    y + ghost.pos.y,
                    1,
                    1
                );

            }

        });

    });

}

let level = 1;
let totalLines = 0;
let holdPiece = null;
let canHold = true;

.header h1{
    color:#00d4ff;
    animation: glow 2s infinite alternate;
}

@keyframes glow{

    from{
        text-shadow:
        0 0 5px #00d4ff,
        0 0 10px #00d4ff;
    }

    to{
        text-shadow:
        0 0 15px #00d4ff,
        0 0 30px #00d4ff;
    }

}

let combo = 0;


draw();
drawNextPiece();
drawArena();
drawGhost();
drawMatrix(player.matrix, player.pos);

