var rows = 38;
var cols = 100;

var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

var timer;
var reproductionTime = 100;

var wall = false;

function initializeGrids() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function resetGrids() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

// Initialize
function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}

// Lay out the board
function createTable() {
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        // Throw error
        console.error("Problem: No div for the drid table!");
    }
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {//
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
    }

    function cellClickHandler() {
        var rowcol = this.id.split("_");
        var row = rowcol[0];
        var col = rowcol[1];
        
        var classes = this.getAttribute("class");
        if(classes.indexOf("live") > -1) {
            this.setAttribute("class", "dead");
            grid[row][col] = 0;
        } else {
            if(!wall)
            {
                this.setAttribute("class", "live");
                grid[row][col] = 1;
            }
            else
            {
                this.setAttribute("class", "wall");
                grid[row][col] = 2;
            }
            
        }
        
    }

    function updateView() {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var cell = document.getElementById(i + "_" + j);
                if (grid[i][j] == 0)
                {
                    cell.setAttribute("class", "dead");
                }
                if (grid[i][j] == 1)
                {
                    cell.setAttribute("class", "live");
                }
                if (grid[i][j] == 2)
                {
                    cell.setAttribute("class", "wall");
                }
            }
        }
    }

function setupControlButtons() {
    // button to start
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    // button to set wall
    var set_wall_Button = document.getElementById('set_wall');
    set_wall_Button.onclick = set_wall_ButtonHandler;

    // button to clear
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    
    // button to set random initial state
    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var isLive = Math.round(Math.random());
            if (isLive == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

// clear the grid
function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    
    playing = false;
    var startButton = document.getElementById('start');
    startButton.innerHTML = "Start";    
    clearTimeout(timer);
    
    var cellsList = document.getElementsByClassName("live");
    // convert to array first, otherwise, you're working on a live node list
    // and the update doesn't work!
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }

    var cellsList = document.getElementsByClassName("wall");
    
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }

    
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids;
}

// start/pause/continue the game
function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continuar";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pausa";
        play();
    }
}

function set_wall_ButtonHandler()
{
    wall = !wall;
    if(wall)
    {
        this.innerHTML = "Modo Setear Muro";
    }
    else
    {
        this.innerHTML = "Setear Bloques de Muro"
    }
}

// run the life game
function play() {
    computeNextGen();
    
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    
    // copy NextGrid to grid, and reset nextGrid
    copyAndResetGrid();
    // copy all 1 values to "live" in the table
    updateView();
}

// Reglas

function applyRules(row, col) {
    if (grid[row][col] == 1) {
        // Verificar si hay un "muro" (vecino con valor 2)
        if (col + 1 < cols && grid[row][col + 1] == 2) {
            // Si el "muro" está a la derecha, avanzar hacia arriba o abajo
            if (row - 1 >= 0 && grid[row - 1][col] != 2) {
                nextGrid[row - 1][col] = 1; // Avanzar hacia arriba si es posible
            } else if (row + 1 < rows && grid[row + 1][col] != 2) {
                nextGrid[row + 1][col] = 1; // Avanzar hacia abajo si es posible
            }
        } else if (row - 1 >= 0 && col + 1 < cols && grid[row - 1][col + 1] == 2) {
            // Si el "muro" está arriba a la derecha, avanzar hacia adelante
            if (col + 2 < cols) {
                nextGrid[row][col + 2] = 1; // Avanzar hacia adelante si es posible
            }
        } else if (row + 1 < rows && col + 1 < cols && grid[row + 1][col + 1] == 2) {
            // Si el "muro" está abajo a la derecha, avanzar hacia adelante
            if (col + 2 < cols) {
                nextGrid[row][col + 2] = 1; // Avanzar hacia adelante si es posible
            }
        } else {
            // Si no hay "muro" cerca, avanzar hacia la derecha si es posible
            if (col + 1 < cols) {
                nextGrid[row][col + 1] = 1;
            }
        }
    } else if (grid[row][col] == 2) {
        // Mantener el "muro" en su posición
        nextGrid[row][col] = 2;
    }
}

// Start everything
window.onload = initialize;
