//Game Data
var game = {
    currentPlayer: 'user',
    moves: [],
    mode: 0,
    status: '',
    size: 3,
    movesCounter: 0
};

var players = {
    user: {
        symbol: '<span class="fa fa-times human"></span>',
        value: 1
    },
    computer: {
        symbol: '<span class="fa fa-circle-o computer"></span>',
        value: -1
    }
};


//Show Modal Window
function start() {
    $('#myModal').modal();
};

setTimeout(start, 600);

$(document).ready(function () {
    $('.btn').on('click', function (event) {
        var id = event.currentTarget.id;
        initGameMode(id);
    });
});

function initGameMode(id) {
    game.mode = Number.parseInt($('#size').val()) || 9;
    game.size = Math.sqrt(game.mode);
    game.moves = fillArray();
    drawPlayingField();
    setPlayer(id);
};

function fillArray() {
    var arr = new Array(game.size).fill(0);

    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(game.size).fill(0)
    };

    return arr;
};

function drawPlayingField() {
    var params = game.size * 134;
    $('.game').css({
        'width': params,
        'height': params
    });

    for (var i = 0; i < game.mode; i++) {
        var gameField = addFieldCell(i);
        $('.game').append(gameField);
    };
    $('.game-field').on('click', userMove);
};

function addFieldCell(i) {
    var containerdiv = document.createElement('div');
    var index = i + 1;
    containerdiv.setAttribute('data-id', i);

    if (index <= game.size && index % game.size == 0) {
        containerdiv.setAttribute('class', 'game-field no-top-line no-right-line');
    } else if (index <= game.size) {
        containerdiv.setAttribute('class', 'game-field no-top-line right-line');
    } else if (index % game.size == 0) {
        containerdiv.setAttribute('class', 'game-field top-line no-right-line');
    } else {
        containerdiv.setAttribute('class', 'game-field top-line right-line');
    };
    return containerdiv;
};

function setPlayer(id) {
    if (id === 'o') {
        players.user.symbol = '<span class="fa fa-circle-o human"></span>';
        players.computer.symbol = '<span class="fa fa-times computer"></span>';
        setCurrentPlayer('computer');
        computerMove();
    }
};

function setCurrentPlayer(player) {
    game.currentPlayer = player;
};

function userMove() {

    var id = $(this).data('id');
    console.log(id);
    setMove(id);
};

function setMove(id) {
    var index = id || 0;

    var row = Math.floor(index / game.size);
    var colm = index % game.size;

    drawMove(index, game.currentPlayer, row, colm);

    if (game.currentPlayer == 'user') {

        setCurrentPlayer('computer');

    } else if (game.currentPlayer == 'computer') {

        setCurrentPlayer('user');
    }

    game.movesCounter++;

    var status = getGameStatus();
    var noDraw = drawCheck();

    if (game.currentPlayer == 'computer' && status != 'win' && noDraw) {
        computerMove();
    };

};

function drawMove(id, role, row, colm) {
    $('[data-id=' + id + ']').html(players[role].symbol);
    $('[data-id=' + id + ']').off('click');
    game.moves[row][colm] = players[role].value;
};

function getGameStatus() {

    var column = Array(game.size).fill(0),
        row = Array(game.size).fill(0),
        mainDiagonal = 0,
        adverseDiagonal = 0;

    for (var i = 0; i < game.moves.length; i++) {
        for (var j = 0; j < game.moves.length; j++) {
            column[j] += game.moves[i][j];
            row[i] += game.moves[i][j];
        }
        mainDiagonal += game.moves[i][i];
        adverseDiagonal += game.moves[i][game.moves.length - 1 - i];
    }

    game.status = winChecker(column, row, mainDiagonal, adverseDiagonal);

    if (game.status == 'win') showWinner();

    return game.status;
};

function winChecker(c, r, m, a) {

    if (c.some(el => Math.abs(el) == game.size) || r.some(el => Math.abs(el) == game.size) || Math.abs(m) == game.size || Math.abs(a) == game.size) {
        return game.status = 'win';
    }
};

function showWinner() {
    game.currentPlayer !== 'user' ? $('#humanWin').show() : $('#computerWin').show();

    lockAllFields();
    setTimeout(resetFields, 1500);
};

function drawCheck() {
    if (game.movesCounter == game.mode && game.status != 'win') {

        lockAllFields();
        setTimeout(resetFields, 1500);

        return false;
    }
    return true;
};

function lockAllFields() {
    $('.game-field').off('click');
};

function resetFields() {
    $('.game-field').on('click', userMove);
    $('.game-field').html('');

    game.moves = fillArray();
    game.movesCounter = 0;
    game.status = '';

    $('#computerWin').hide();
    $('#humanWin').hide();

    if (players.user.symbol == '<span class="fa fa-times human"></span>') {
        setCurrentPlayer('user');
    } else {
        setCurrentPlayer('computer');
        computerMove();
    }
};

function computerMove() {
    var randomX = getRandomInt(0, game.size - 1);
    var randomY = getRandomInt(0, game.size - 1);
    var index = randomX * game.size + randomY;

    if (game.moves[randomX][randomY] == 0) {
        setMove(index);
    } else {
        computerMove();
    }
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};