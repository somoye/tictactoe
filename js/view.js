$(document).ready(function () {

    $('.btn').on('click', function () {
        var divId,
            gameField,
            gameFieldSize = $('#size').val(),
            params = Math.sqrt(gameFieldSize);

        $('.game').css('width', params * 134);
        $('.game').css('height', params * 134);

        for (var i = 1; i <= gameFieldSize; i++) {
            divId = 'f' + i;
            gameField = createGameHtml(i, divId);
            $('.game').append(gameField);
        }

        function createGameHtml(i, id) {
            var containerdiv = document.createElement('div');
            containerdiv.setAttribute('id', id);
            containerdiv.setAttribute('onclick', 'chooseMove(this.id)');

            if (i <= params && i % params == 0) {
                containerdiv.setAttribute('class', 'game-field no-top-line no-right-line');
            } else if (i <= params) {
                containerdiv.setAttribute('class', 'game-field no-top-line right-line');
            } else if (i % params == 0) {
                containerdiv.setAttribute('class', 'game-field top-line no-right-line');
            } else {
                containerdiv.setAttribute('class', 'game-field top-line right-line');
            }

            return containerdiv;
        }


    });

});