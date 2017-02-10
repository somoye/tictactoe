//Game Data
var game = {
    currentPlayer: 'user',
    moves: [],
    mode: 9,
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
        initGameMode();
        drawPlayingField();
        setPlayer(event);
    });

    function drawPlayingField() {
        var params = game.size * 134;
        $('.game').css({
            'width': params,
            'height': params
        });

        for (var i = 1; i <= game.mode; i++) {
            var divId = 'f' + i;
            var gameField = addFieldCell(i, divId);
            $('.game').append(gameField);
        }
        $('.game-field').on('click', setMove);
    };

    function addFieldCell(i, id) {
        var containerdiv = document.createElement('div');
        containerdiv.setAttribute('id', id);

        if (i <= game.size && i % game.size == 0) {
            containerdiv.setAttribute('class', 'game-field no-top-line no-right-line');
        } else if (i <= game.size) {
            containerdiv.setAttribute('class', 'game-field no-top-line right-line');
        } else if (i % game.size == 0) {
            containerdiv.setAttribute('class', 'game-field top-line no-right-line');
        } else {
            containerdiv.setAttribute('class', 'game-field top-line right-line');
        };
        return containerdiv;
    };

    function setPlayer(event) {

        var id = event.currentTarget.id;

        if (id === 'o') {
            players.user.symbol = '<span class="fa fa-circle-o human"></span>';
            players.computer.symbol = '<span class="fa fa-times computer"></span>';
            setCurrentPlayer('computer');
            computerMove();
        }
    };

    //Initial Settings: Set figures, Current Player and Game Mode

});


function initGameMode() {
    game.mode = Number.parseInt($('#size').val()) || 9;
    game.size = Math.sqrt(game.mode);
    game.moves = fillArray();
};

function fillArray() {
    var arr = [];
    for (var i = 0; i < game.size; i++) {
        arr[i] = [];

        for (var j = 0; j < game.size; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
};

function setCurrentPlayer(player) {
    game.currentPlayer = player;
};

//Mark player's turn, check the status of the game, reset in case of draw
function setMove(id) {

    var id = this.id || id;
    var index = id.slice(1) - 1;
    var row = Math.floor(index / game.size);
    var colm = index % game.size;

    if (game.currentPlayer == 'user') {
        drawMove(id, game.currentPlayer, row, colm);
        setCurrentPlayer('computer');

    } else if (game.currentPlayer == 'computer') {
        drawMove(id, game.currentPlayer, row, colm);
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
    $('#' + id).html(players[role].symbol);
    $('#' + id).off();
    game.moves[row][colm] = players[role].value;
}

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
}

function lockAllFields() {
    $('.game-field').removeAttr('onclick');
};

function resetFields() {
    $('.game-field').on('click', setMove);
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
    var computerChoice = getRandomInt(1, game.mode);

    if ($('#f' + computerChoice).html() != players.user.symbol && $('#f' + computerChoice).html() != players.computer.symbol) {
        setMove('f' + computerChoice)
    } else {
        computerMove()
    }
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

function drawCheck() {
    if (game.movesCounter == game.mode) {
        setTimeout(resetFields, 1000);
    }
    return true;
};