//Game Data
var game = {
    user: '',
    computer: '',
    currentPlayer: '',
    moves: [],
    mode: 0
};

//Show Modal Window
function start() {
    $('#myModal').modal();
};

setTimeout(start, 600);

//Initial Settings: Set figures, Current Player and Game Mode
$(document).ready(function () {
    $('.btn').click(function setPlayer() {
        var id = this.id;

        if (id === 'x') {
            game.user = '<span class="fa fa-times human"></span>';
            game.computer = '<span class="fa fa-circle-o computer"></span>';

        } else if (id === 'o') {
            game.user = '<span class="fa fa-circle-o human"></span>';
            game.computer = '<span class="fa fa-times computer"></span>';
        }
        setGameMode();
        setFirstMove();
        setCurrentPlayer('user');
    });
});


function setGameMode() {
    game.mode = Number.parseInt($('#size').val());
    game.moves = Array(game.mode).fill(0);
};


function setFirstMove() {
    $('#f1').html(game.computer);
    $('#f1').removeAttr('onclick');
    game.moves[0] = -1;
};

function setCurrentPlayer(player) {
    game.currentPlayer = player;
};

//Mark player's turn, check the status of the game, reset in case of draw
function chooseMove(id) {
    var status;
    var index = id.slice(1) - 1;

    if (game.currentPlayer == 'user') {
        $('#' + id).html(game.user);
        $('#' + id).removeAttr('onclick');
        game.moves[index] = 1;
        setCurrentPlayer('computer');
        status = getGameStatus();
    } else if (game.currentPlayer == 'computer') {
        $('#' + id).html(game.computer);
        $('#' + id).removeAttr('onclick');
        game.moves[index] = -1;
        setCurrentPlayer('user');
        status = getGameStatus();
    }
    if (game.currentPlayer == 'computer' && status != 'win') {
        computerMove();
    }
    draw();
};

function getGameStatus() {
    var size = Math.sqrt(game.mode);
    var matrix = toMatrix(game.moves, size);
    var status,
        colWin = Array(size).fill(0),
        rowWin = Array(size).fill(0),
        mainWin = 0,
        adverseWin = 0;

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix.length; j++) {
            colWin[j] += matrix[i][j];
            rowWin[i] += matrix[i][j];
        }
    }

    for (var i = 0; i < matrix.length; i++) {
        mainWin += matrix[i][i];
        adverseWin += matrix[i][matrix.length - 1 - i];
    }

    if (colWin.some(el => Math.abs(el) == size) || rowWin.some(el => Math.abs(el) == size) || Math.abs(mainWin) == size || Math.abs(adverseWin) == size) {
        lockAllFields();
        console.log('cool');
        setTimeout(resetFields, 1500);
        status = 'win';
    }
    return status;
};

function toMatrix(data, rowSize) {

    var matrix = [];
    for (var i = 0; i < data.length; i += rowSize) {
        matrix.push(data.slice(i, i + rowSize));
    }
    return matrix;

}

function lockAllFields() {
    $('.game-field').removeAttr('onclick');
};

function resetFields() {
    $('.game-field').attr('onclick', 'chooseMove(this.id)');
    $('.game-field').html('');

    game.moves = Array(game.mode).fill(0);

    $('div').removeClass('win');

    setTimeout(setFirstMove, 500);
    setCurrentPlayer('user');
};

function computerMove() {
    var computerChoice = getRandomInt(1, game.mode);

    if ($('#f' + computerChoice).html() != game.user && $('#f' + computerChoice).html() != game.computer) {
        chooseMove('f' + computerChoice)
    } else {
        computerMove()
    }
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function draw() {
    if (game.moves.every(el => el !== 0)) {
        setTimeout(resetFields, 1000);
    }
};