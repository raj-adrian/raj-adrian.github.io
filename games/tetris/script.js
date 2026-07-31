const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

ctx.scale(20, 20);

const scoreElement = document.getElementById("score");

const colors = [
    null,
    "#00ffff",
    "#0000ff",
    "#ff8800",
    "#ffff00",
    "#00ff00",
    "#aa00ff",
    "#ff0000"
];

const arena = createMatrix(12, 20);

const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0
};

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
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
        ];
    } else if (type === "O") {
        return [
            [4, 4],
            [4, 4]
        ];
    } else if (type === "L") {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ];
    } else if (type === "J") {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 0]
        ];
    } else if (type === "I") {
        return [
            [1, 1, 1, 1]
        ];
    } else if (type === "S") {
        return [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0]
        ];
    } else if (type === "Z") {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ];
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = colors[value];
                ctx.fillRect(
                    x + offset.x,
                    y + offset.y,
                    1,
                    1
                );
            }
        });
    });
}

function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;

    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if (
                m[y][x] !== 0 &&
                (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0
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
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function arenaSweep() {
    outer:
    for (let y = arena.length - 1; y > 0; y--) {
        for (let x = 0; x < arena[y].length; x++) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);

        player.score += 10;
        updateScore();
        y++;
    }
}

function rotate(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [
                matrix[x][y],
                matrix[y][x]
            ] =
            [
                matrix[y][x],
                matrix[x][y]
            ];
        }
    }

    matrix.forEach(row => row.reverse());
}

function playerRotate() {
    rotate(player.matrix);
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

function playerMove(dir) {
    player.pos.x += dir;

    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = "TJLOSZI";

    player.matrix =
        createPiece(
            pieces[
                pieces.length *
                Math.random() | 0
            ]
        );

    player.pos.y = 0;
    player.pos.x = 5;

    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function updateScore() {
    scoreElement.textContent = player.score;
}

let dropCounter = 0;
let dropInterval = 700;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
        playerMove(-1);
    } else if (event.key === "ArrowRight") {
        playerMove(1);
    } else if (event.key === "ArrowDown") {
        playerDrop();
    } else if (event.key === "ArrowUp") {
        playerRotate();
    }
});

playerReset();
updateScore();
update();
