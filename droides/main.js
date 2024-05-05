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
                this.setAttribute("class", "gungano");
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
                    cell.setAttribute("class", "gungano");
                }
            }
        }
    }

function setupControlButtons() {
    // button to start
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    // button to set wall
    var set_gungano_Button = document.getElementById('set_gungano');
    set_gungano_Button.onclick = set_gungano_ButtonHandler;

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
            var cellType = Math.random() < 0.3 ? 1 : (Math.random() < 0.2 ? 2 : 0); // Probabilidad del 30% para cada tipo de célula, con un 40% de células vacías
            var cell = document.getElementById(i + "_" + j);
            if (cellType == 1) {
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            } else if (cellType == 2) {
                cell.setAttribute("class", "gungano");
                grid[i][j] = 2;
            } else {
                cell.setAttribute("class", "dead");
                grid[i][j] = 0;
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

function set_gungano_ButtonHandler()
{
    wall = !wall;
    if(wall)
    {
        this.innerHTML = "Modo Setear Gungano";
    }
    else
    {
        this.innerHTML = "Setear Bloques de Gunganos"
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
    var countCell1 = 0;
    var countCell2 = 0;
    if (grid[row][col] == 1) {
        // Célula de tipo 1 (izquierda a derecha)
        if (col + 1 < cols && grid[row][col + 1] == 2) {
            // Combate con célula de tipo 2
            nextGrid[row][col] = 0;
            nextGrid[row][col + 1] = 0;
        } else if (col + 1 < cols && grid[row][col + 1] == 0) {
            // Avanza hacia la derecha si no hay obstáculos
            nextGrid[row][col] = 0;
            nextGrid[row][col + 1] = 1;
        }
    } else if (grid[row][col] == 2) {
        // Célula de tipo 2 (derecha a izquierda)
        if (col - 1 >= 0 && grid[row][col - 1] == 1) {
            // Combate con célula de tipo 1
            nextGrid[row][col] = 0;
            nextGrid[row][col - 1] = 0;
        } else if (col - 1 >= 0 && grid[row][col - 1] == 0) {
            // Avanza hacia la izquierda si no hay obstáculos
            nextGrid[row][col] = 0;
            nextGrid[row][col - 1] = 2;
        }
    }
    // Contar células de cada tipo
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (nextGrid[i][j] == 1) {
                countCell1++;
            } else if (nextGrid[i][j] == 2) {
                countCell2++;
            }
        }
    }

    // Mostrar información en la consola
    var infoElement = document.getElementById('info');
infoElement.innerHTML = "<strong>Droides:</strong> " + countCell1 + "<br>" +
                         "<strong>Gunganos:</strong> " + countCell2 + "<br>" +
                         (countCell1 > countCell2 ? "<strong>¡Droides van ganando!</strong>" :
                          (countCell2 > countCell1 ? "<strong>¡Gunganos van ganando!</strong>" :
                           "<strong>¡Empate!</strong>"));


}


// Start everything
window.onload = initialize;
