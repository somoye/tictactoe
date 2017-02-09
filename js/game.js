//Game Data
var game = {
    user: '',
    computer: '',
    currentPlayer: '',
    moves: [],
    mode: 9,
    status: '',
    size: 3,
    movesCounter: 0
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
            setCurrentPlayer('user');
            setGameMode();

        } else if (id === 'o') {
            game.user = '<span class="fa fa-circle-o human"></span>';
            game.computer = '<span class="fa fa-times computer"></span>';
            setCurrentPlayer('computer');
            setGameMode();
            computerMove();
        }
    });
});


function setGameMode() {
    game.mode = Number.parseInt($('#size').val()) || 9;
    game.size = Math.sqrt(game.mode);
    fillArray();
};

function fillArray() {

    for (var i = 0; i < game.size; i++) {
        game.moves[i] = [];

        for (var j = 0; j < game.size; j++) {
            game.moves[i][j] = 0;
        }
    }
    console.log(game.moves);
};

function setCurrentPlayer(player) {
    game.currentPlayer = player;
};

//Mark player's turn, check the status of the game, reset in case of draw
function chooseMove(id) {

    var status,
        rowNumber,
        colNumber;
    var id = this.id || id;
    console.log(id);
    var index = id.slice(1) - 1;
    rowNumber = Math.floor(index / game.size);
    colNumber = index % game.size;

    if (game.currentPlayer == 'user') {
        $('#' + id).html(game.user);
        $('#' + id).off();

        game.moves[rowNumber][colNumber] = 1;
        setCurrentPlayer('computer');
        status = getGameStatus();
        game.movesCounter++;
    } else if (game.currentPlayer == 'computer') {
        $('#' + id).html(game.computer);
        $('#' + id).off();

        game.moves[rowNumber][colNumber] = -1;
        setCurrentPlayer('user');
        status = getGameStatus();
        game.movesCounter++;
    }
    if (game.currentPlayer == 'computer' && status != 'win' && game.movesCounter != game.mode) {
        computerMove();

    };
    draw();
};

var e = jQuery.Event.currentTarget;
var divclick = chooseMove.bind(e);


function getGameStatus() {

    //    var matrix = toMatrix(game.moves, game.size);
    var colWin = Array(game.size).fill(0),
        rowWin = Array(game.size).fill(0),
        mainWin = 0,
        adverseWin = 0;

    for (var i = 0; i < game.moves.length; i++) {
        for (var j = 0; j < game.moves.length; j++) {
            colWin[j] += game.moves[i][j];
            rowWin[i] += game.moves[i][j];
        }
    }

    for (var i = 0; i < game.moves.length; i++) {
        mainWin += game.moves[i][i];
        adverseWin += game.moves[i][game.moves.length - 1 - i];
    }

    if (colWin.some(el => el == game.size) || rowWin.some(el => el == game.size) || mainWin == game.size || adverseWin == game.size) {
        lockAllFields();
        setTimeout(resetFields, 1500);
        game.status = 'win';
        $('#humanWin').show();
    }
    if (colWin.some(el => el == game.size * (-1)) || rowWin.some(el => el == game.size * (-1)) || mainWin == game.size * (-1) || adverseWin == game.size * (-1)) {
        lockAllFields();
        setTimeout(resetFields, 1500);
        game.status = 'win';
        $('#computerWin').show();
    }
    return game.status;
};

function lockAllFields() {
    $('.game-field').removeAttr('onclick');
};

function resetFields() {
    $('.game-field').attr('onclick', 'chooseMove(this.id)');
    $('.game-field').html('');

    fillArray();
    game.movesCounter = 0;
    game.status = '';

    $('#computerWin').hide();
    $('#humanWin').hide();

    if (game.user == '<span class="fa fa-times human"></span>') {
        setCurrentPlayer('user');
    } else {
        setCurrentPlayer('computer');
        computerMove();
    }
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

    if (game.movesCounter == game.mode) {
        setTimeout(resetFields, 1000);
    }
};