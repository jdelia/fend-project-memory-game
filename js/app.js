/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

var cards;
var timer;
var score;
var success;
var starsRemoved = 0;
var moves = 0;
var actualTime;
var cardsOpen = [];
var cardsMatched = 0;
var clockID = null;
var firstClick = true;
var timer = [0, 0, 0, 600100];
var interval;
var timerRunning = false;

const CLOCK = document.querySelector(".clock");
const MOVES = document.querySelector(".moves");
const STARS = document.querySelector(".stars");
const DECK = document.querySelector(".deck");
const RESTART = document.querySelector(".restart");
const CARDSET = [
	"diamond",
	"diamond",
	"paper-plane-o",
	"paper-plane-o",
	"anchor",
	"anchor",
	"bolt",
	"bolt",
	"cube",
	"cube",
	"leaf",
	"leaf",
	"bicycle",
	"bicycle",
	"bomb",
	"bomb"
];

function generateCard(card) {
	return `<li data-card="${card}" class="card"><div class="front"></div><div class="back"><i class="fa fa-${card}"></div></i></li>`;
}

function updateStars() {
	// number of stars right now
	list = STARS.querySelectorAll("li");

	console.log("List", list);
	// if (list.length > 0) {
	// 	if (moves > 12 && moves <= 16) {
	// 		list[list.length - 1].remove();
	// 	}
	// 	if (moves > 16 && moves <= 20) {
	// 		list[list.length - 1].remove();
	// 	}
	// 	if (moves > 20 && moves <= 24) {
	// 		list[list.length - 1].remove();
	// 	}
	// 	if (moves > 24 && moves <= 30) {
	// 		list[list.length - 1].remove();
	// 	}
	// }
}

// Add a leading zero to single digit numbers for nicely formatted display.
function leadingZero(time) {
	if (time <= 9) {
		time = "0" + time;
	}
	return time;
}

// Run a time with mins, secs and hundredths of secs.
function runClock() {
	let currentTime =
		leadingZero(timer[0]) +
		":" +
		leadingZero(timer[1]) +
		":" +
		leadingZero(timer[2]);
	CLOCK.innerHTML = currentTime;

	/* We are running this 100 times per second.
	so 100cs = 1000ms and 1cs = 10ms
	Example:
	60000ms * (100cs / 1000ms)= 6000cs or  1 min
	6000cs * (1m / 6000cs) = 60secs or 1 min
	use Math.floor to drop any remainder in division.
	timer[3] keeps the total number of cs counted
	*/

	timer[3]++;

	// timer[0] is number of minutes - so 1 minute is 6000cs
	timer[0] = Math.floor(timer[3] / 6000);

	// timer[1] is number of seconds
	// 6000cs / 100 = 60 - 60 = 0
	timer[1] = Math.floor(timer[3] / 100 - timer[0] * 60);

	// timer[2] is number of 100th seconds.

	timer[2] = Math.floor(timer[3] - timer[1] * 100 - timer[0] * 6000);

	if (timer[3] > 12607000) {
		gameOver();
	}
}

function showMoves() {
	MOVES.innerHTML = moves;
	updateStars();
}

function endGame() {
	stopTimer();
	window.alert(" You won!");
}

function gameOver() {
	stopTimer();
	window.alert(" Oh. Sorry - you're out of time. Try again");
	resetGame();
}

function addListeners() {


	DECK.addEventListener("click", function (e) {
		console.log("Click:", e.target);
		if (e.target && e.target.classList == "front") {
			if (firstClick) {
				startTimer();
				firstClick = false;
			}
			card = e.target.parentElement;
			console.log("Click:", card);

			if (!card.classList.contains("match") && cardsOpen.length < 2) {
				if (!card.classList.contains("open", "show")) {
					cardsOpen.push(card);
					card.classList.add("open", "show");
				}
			}

			console.log("Open Cards: ", cardsOpen.length);

			if (cardsOpen.length == 2) {
				moves++;
				//	showMoves();

				if (cardsOpen[0].getAttribute("data-card") == cardsOpen[1].getAttribute("data-card")) {
					cardsOpen[0].classList.add("match");
					cardsOpen[1].classList.add("match");
					cardsMatched = cardsMatched + 2;
					console.log("Cards Open:", cardsOpen);
					setTimeout(function () {
						cardsOpen[0].classList.remove("open", "show");
						cardsOpen[1].classList.remove("open", "show");
						cardsOpen = [];
						if (cardsMatched == 16) {
							// Winner!
							endGame();
						}
					}, 1000);

				} else {
					cardsOpen[0].classList.add("mismatched");
					cardsOpen[1].classList.add("mismatched");
					setTimeout(function () {
						console.log("Cards Open:", cardsOpen);
						cardsOpen[0].classList.add("animated", "wobble");
						cardsOpen[1].classList.add("animated", "wobble");
					}, 1000);

					setTimeout(function () {
						console.log("Cards Open:", cardsOpen);
						if (cardsOpen.length == 2) {
							cardsOpen[0].classList.remove(
								"open",
								"show",
								"animated",
								"wobble",
								"mismatched"
							);
							cardsOpen[1].classList.remove(
								"open",
								"show",
								"animated",
								"wobble",
								"mismatched"
							);
							cardsOpen = [];
						}
					}, 2000);
				}
			}
		}
	});
}

function startTimer() {
	// Run this 100 times per second
	clockID = setInterval(runClock, 10);
}

function stopTimer() {
	timerRunning = false;
	clearInterval(clockID);
	actualTime = CLOCK.innerHTML;
	console.log(actualTime);
}

function resetTimer() {
	time = 0;
	CLOCK.innerHTML = "00:00:00";
}

function resetGame() {
	// reset cards, score and timer.
	stopTimer();
	resetTimer();
	moves = 0;
	timer = [0, 0, 0, 0];
	timerRunning = false;
	cardsOpen = [];
	cardsMatched = 0;
	firstClick = true;
	console.log("Reset running");
	showMoves();
	loadCards();
	addListeners();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function loadCards() {
	var cardsHTML = shuffle(
		CARDSET.map(function (card) {
			return generateCard(card);
		})
	);

	DECK.innerHTML = cardsHTML.join(" ");
}

// Initialize Game
function initGame() {
	// load game to start over.

	RESTART.addEventListener("click", function (e) {
		console.log("Reset pressed");

		resetGame();
	});

	loadCards();
	addListeners();
}

initGame();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
