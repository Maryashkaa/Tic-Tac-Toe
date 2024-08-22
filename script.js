//объект геймбоард, который хранит состояние игры
const Gameboard = (() => {
    let board = ['','','','','','','','','',];

    //функция получения состояния доски
    const getBoard = function(){
        return this.board; 
        //this для доступа к боард внутри объекта
    };

    // функция для размещения X или O 
    const placeMarker = function(index, marker) {
        if (this.board[index] === '') { // проверяем,пустая ли ячейка
            this.board[index] = marker; // если да,туда маркер
        }
    };
    //функция очистки доски, когда мы хотим начать новую игру
    const resetBoard = function() {
        this.board = ['', '', '', '', '', '', '', '', '']; // Снова делаем ячейки пустыми
    };
    // Возвращаем функции, чтобы их можно было использовать снаружи этого объекта
    return { board, getBoard, placeMarker, resetBoard };
})();

// создаем объект player, который хранит данные о кажом игре
const Player = function(name, marker){
    this.name = name; 
    this.marker = marker;
};
// Создаем объект GameController (Контроллер игры), который управляет ходом игры
const GameController = (() => {
    const player1 = new Player('Player 1', 'X');
    const player2 = new Player('Player 2', 'O');
    let currentPlayer = player1;

    // Функция для переключения хода между игроками
    const switchPlayer = function() {
        this.currentPlayer = this.currentPlayer === player1 ? player2 : player1;
    };
    // Функция для проверки, выиграл ли кто-нибудь
    const checkWinner = function() {
        const board = Gameboard.getBoard(); 
        const winConditions = [ //  комбинации для выигрыша
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]             
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // Возвращаем X O, если кто-то выиграл
            }
        }

        if (!board.includes('')) {
            return 'Draw'; // Возвращаем если ничья
        }

        return null; // Иначе никто не выиграл и не ничья, игра продолжается
    };


    // Функция для обработки кликов по ячейкам доски
    const handleCellClick = function(index) {
        const board = Gameboard.getBoard();

        if (board[index] === '' && !checkWinner()) {
            Gameboard.placeMarker(index, this.currentPlayer.marker); // Используем this, чтобы указать текущего игрока
            if (checkWinner()) {
                alert(`${this.currentPlayer.name} wins!`);
            } else if (checkWinner() === 'Draw') {
                alert(`It's a draw!`);
            } else {
                this.switchPlayer(); // Переключаем игрока с использованием tёhis
            }
            DisplayController.updateBoard();
        }
    };

    // Функция для перезапуска игры
    const restartGame = function() {
        Gameboard.resetBoard(); // Сбрасываем доску
        this.currentPlayer = player1; // Снова начинаем с 1 игрока
        DisplayController.updateBoard(); // Обновляем 
    };

    return { handleCellClick, restartGame, switchPlayer };
})();

// Объект DisplayController для управления отображением игры на экране
const DisplayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart');

    const updateBoard = function() {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    cells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
            GameController.handleCellClick(index);
        });
    });

    restartButton.addEventListener('click', function() {
        GameController.restartGame();
    });

    return { updateBoard };
})();