
				if (99 == "99") {
				    console.log("A number equals a string!"); } else 
				{    console.log("No way a number equals a string");}
var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};


var model = {
	boardSize: 7,		//размер сетки игрового поля
	numShips: 3,  //количество кораблей
	shipsSunk: 0,	//количество потопленых кораблей
	shipLength: 3,	//длина каждого корабля
	ships: [{ locations: ["0", "0", "0"], hits: ["", "", ""]},//позиции кораблей и координаты попаданий
					{ locations: ["0", "0", "0"], hits: ["", "", ""]},
					{ locations: ["0", "0", "0"], hits: ["", "", ""]}],
fire: function(guess) { //метод для выполнения выстрела и проверки результата
	for (var i = 0; i < this.numShips; i++) {
		var ship = this.ships[i];
		var index = ship.locations.indexOf(guess);
//если координаты клетки присутствуют в массиве locations значит выстрел попал в цель
			if (index >= 0) {										//ставим отметку в массива hits по тому же индексу
				ship.hits[index] = "hit"; // добавляем отметку в масив попаданий
				view.displayHit(guess);				//Оповещаем представление о том что в клетке guess следует вывести маркер попадания
				view.displayMessage("HIT!");
				if (this.isSunk(ship)) { //добавим проверку здесь после того как будем точно знать что выстрел попал в корабль
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},
isSunk: function(ship) { //метод получает объект корабля и проверяет помечены ли все его клетки маркером попадания
		//var ship = this.ships[i];
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
  },
generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {//набор позиций (клеток)
      do {
        locations = this.generateShip();
      } while (this.collision(locations));//проверка на пересикание позиций
      this.ships[i].locations = locations;//сохранение в масиве model.ships
    }
  },
generateShip: function() { //генерация позиций и направления корабля
  var direction = Math.floor(Math.random() * 2);
  var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);// начальная поз.корабля до конца конструкции
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
          newShipLocations.push(row + "" + (col + i));
      } else {
          newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },
collision: function(locations) {
  for (var i = 0; i < this.numShips; i++) {
    var ship = model.ships[i];
    for (var j = 0; j < locations.length; j++) {
      if (ship.locations.indexOf(locations[j]) >= 0) {
        return true;
      }
    }
  }
  return false;
  }
};


var controller = {
	guesses: 0, //иницифлизация объекта

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location){ //если метод не возвращает null значит был получен действительный объект location
			this.guesses++;// шоб зробити подсчет выстрелов при неправильном вводе то используем другой цикл
			var hit = model.fire(location);// комбинация строки и столбца передаеться методу fire
			if (hit && model.shipsSunk === model.numShips) { 
			//если потопленных кораблей равно количеству кораблей в игре, выводиться сообщение что все корабли потоплены
        view.displayMessage("You sank all my battleships, in " 
          + this.guesses + " guesses");
// выводим общее количество выстрелов, которое потребовалось игроку для того, чтобы потопить корабли
			}
		}
	}
};

function parseGuess(guess) { 
		var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) { //проверка на null и на два символа
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		firstChar = guess.charAt(0);			//первый символ строки
		var row = alphabet.indexOf(firstChar); // получаем цифру в диапазоне от 0 до 6 соответствующую букве в масиве
		var column = guess.charAt(1);  //получение второго символа представляющего столбец игрового поля
	
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
																				 column < 0 || column >= model.boardSize) {
//здесь применяеться преобразование типов column
// запрашиваем размер доски у модели и используем для сравнения molel.boardSize
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}

function init() {
	var fireButton = document.getElementById("fireButton");//ссылка на кнопку fire!
	fireButton.onclick = handleFireButton; //назначиние обработчика событий
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;//обработчик событий нажатия клавиш в полу ввода html
  model.generateShipLocations();//
}



function handleFireButton() {//функция которая вызываеться при каждом нажатии на кнопку
	var guessInput = document.getElementById("guessInput");//ссылка на элемент по индентификатору
	var guess = guessInput.value;//извлечиние данных введенных пользователем
	controller.processGuess(guess);//передача данных контроллеру

	guessInput.value = "";//удаляем содержимое элемента input
}
function handleKeyPress(e) {
   var fireButton = document.getElementById("fireButton");
   if (e.keyCode === 13) {
   fireButton.click();
   return false;
   }
}//обработчик нажатий клавиш





window.onload = init;//браузер выполняет init при полной загрузке

