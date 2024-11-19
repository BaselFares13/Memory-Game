let game = document.querySelector(".game");
let cards = Array.from(document.getElementsByClassName("card"));
let maximumNumberOfAttemptsSpan = document.querySelector("aside .maximum-number-of-attempts span");
let currentNumberOfAttemptsSpan = document.querySelector("aside .current-number-of-attempts span");
let alert = document.querySelector(".alert-overlay");
let mainAlert = document.querySelector(".alert-overlay.main");
let chooseDifficultyButton = document.querySelector(".choose-difficulty");
let cardFlippingSound = new Audio("sounds/flippingCard.mp3");
let failedInOneSound = new Audio("sounds/failedInOne.mp3");
let successInOneSound = new Audio("sounds/successInOne_bell-6776.mp3");
let winnerSound = new Audio("sounds/Winner.mp3");
let gameOverSound = new Audio("sounds/gameOver.mp3");
let gameStartSound = new Audio("sounds/game-start-6104.mp3");


window.onload = function () {
    mainAlert.classList.add("show");
}

setCardsDefaultMode();

let currentNumberOfAttempts = 0;
let maximumNumberOfAttempts = 0;
let numberOfSuccessfulAttempts = 0;
let numberOfUniqueCards = cards.length / 2;

let numberOfClicks = 0;
let lastFlippedCard = document.createElement("div");
lastFlippedCard.setAttribute("data-number", "0");

maximumNumberOfAttemptsSpan.textContent = maximumNumberOfAttempts;
currentNumberOfAttemptsSpan.textContent = currentNumberOfAttempts;

cards.forEach((card) => {

    card.onclick = function () {

        if (this.children[0].classList.contains("frozen")) return false;

        cardFlippingSound.load();
        cardFlippingSound.play();

        this.children[0].classList.add("frozen");
        this.children[0].classList.toggle("flip");

        if (this.children[0].classList.contains("flip") && (numberOfClicks % 2 != 0)) {

            numberOfClicks = 0;

            let lastCard = lastFlippedCard;
            let currentCard = this;

            game.classList.add("no-click")

            setTimeout(() => {
                if (currentCard.getAttribute("data-number") === lastCard.getAttribute("data-number")) {

                    lastCard.children[0].classList.add("frozen");
                    currentCard.children[0].classList.add("frozen")
                    ++numberOfSuccessfulAttempts;

                    if (numberOfSuccessfulAttempts === numberOfUniqueCards) {

                        alert.children[0].children[0].textContent = "Winner Winner Chicken Dinner";
                        alert.classList.add("show");

                        winnerSound.load();
                        winnerSound.play();

                        game.classList.remove("no-click")

                        return false;

                    } else {

                        successInOneSound.load();
                        successInOneSound.play();

                    }

                } else {

                    lastCard.children[0].classList.toggle("flip");
                    currentCard.children[0].classList.toggle("flip");

                    currentCard.children[0].classList.remove("frozen");
                    lastCard.children[0].classList.remove("frozen");

                    failedInOneSound.load();
                    failedInOneSound.play();

                }

                currentNumberOfAttemptsSpan.textContent = ++currentNumberOfAttempts;

                if (currentNumberOfAttempts === maximumNumberOfAttempts) {

                    alert.children[0].children[0].textContent = "Game Over !";
                    alert.classList.add("show");

                    gameOverSound.load();
                    gameOverSound.play();

                }

                game.classList.remove("no-click")

            }, 500);

            lastFlippedCard = document.createElement("div");
            lastFlippedCard.setAttribute("data-number", "0");

        } else {

            if (this.getAttribute("data-number") !== lastFlippedCard.getAttribute("data-number")) {

                lastFlippedCard = this;
                numberOfClicks++;

            }

        }
    }
});


chooseDifficultyButton.onclick = function () {

    mainAlert.classList.add("show");

    setCardsDefaultMode();

    numberOfSuccessfulAttempts = 0;

    numberOfClicks = 0;

    currentNumberOfAttempts = 0;
    currentNumberOfAttemptsSpan.textContent = currentNumberOfAttempts;
}

document.addEventListener("click", function (e) {
    gameStartSound.load();

    if (e.target.classList.contains("try-again")) {

        e.target.parentNode.parentNode.classList.remove("show");

        setCardsDefaultMode();

        numberOfSuccessfulAttempts = 0;

        currentNumberOfAttempts = 0;
        currentNumberOfAttemptsSpan.textContent = currentNumberOfAttempts;

        gameStartSound.play();

    }

    if (e.target.classList.contains("hard")) {

        e.target.parentNode.parentNode.classList.remove("show");

        maximumNumberOfAttempts = 10;

        gameStartSound.play();

    }

    if (e.target.classList.contains("normal")) {

        e.target.parentNode.parentNode.classList.remove("show");

        maximumNumberOfAttempts = 15;

        gameStartSound.play();

    }

    if (e.target.classList.contains("easy")) {

        e.target.parentNode.parentNode.classList.remove("show");

        maximumNumberOfAttempts = 20;

        gameStartSound.play();

    }

    maximumNumberOfAttemptsSpan.textContent = maximumNumberOfAttempts;

})

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
    
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


function addCardsToGame(array) {
    for (let i = 0; i < array.length; i++) {
        game.appendChild(array[i]);
    }
}

function clearAllflipsAndFrozenClass(array) {
    for (let i = 0; i < array.length; i++) {
        let ele = array[i].children[0];

        if (ele.classList.contains("flip")) {
            ele.classList.remove("flip")
        }

        if (ele.classList.contains("frozen")) {
            ele.classList.remove("frozen")
        }
    }

    return array;
}

function setCardsDefaultMode() {
    cards = shuffle(cards);

    cards = clearAllflipsAndFrozenClass(cards);

    game.innerHTML = "";

    addCardsToGame(cards);
}

window.addEventListener('resize', function () {
    cards.forEach((card) => {
        card.style.height = `${card.offsetWidth}px`;
    })
});