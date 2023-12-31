/*
Copyright (C) 2023 XnonXte - This application is released under MIT License.
*/

const userInput = document.getElementById("answer-input");
const submitInputButton = document.getElementById("submit-button");
const startInputButton = document.getElementById("start");
const nextInputButton = document.getElementById("next");
const restartInputButton = document.getElementById("restart");
const topTextDivContainer = document.getElementById("start-text-container");
const questionDivContainer = document.getElementById("question-container");
const formDivContainer = document.getElementById("form-container");
const questionHeading = document.getElementById("question");
const htmlBodyElement = document.querySelector("body");
const endingTextDivContainer = document.getElementById("end-text-container");
const endingText = document.getElementById("end-text");
const gameHistoryList = document.getElementById("game-history");

let currentQuestionIndex, correctAnswerCount, answersLogArray, questions;

function getQuestions(callback) {
  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  for (let i = 0; i < 10; i++) {
    const operation = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
    let num1 = getRandomInt(1, 50);
    let num2 = getRandomInt(1, 50);

    if (operation === "/") {
      // Ensure division has an integer result and avoid division by zero.
      num2 = getRandomInt(1, 20);
      num1 = num2 * getRandomInt(1, 10);
    }

    let answer;
    switch (operation) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
      case "/":
        answer = num1 / num2;
        break;
    }

    const question = `${num1} ${operation} ${num2}`;
    questions.push({
      question,
      answer,
    });
  }

  callback();
}

startInputButton.addEventListener("click", startGame);
submitInputButton.addEventListener("click", processAnswer);
nextInputButton.addEventListener("click", setNextQuestion);

function startGame() {
  answersLogArray = [];
  questions = []; // Clear old questions.

  getQuestions(() => {
    // We put this inside a callback function so it will run after the initial function.
    startInputButton.classList.add("hide");
    topTextDivContainer.classList.add("hide");
    submitInputButton.classList.remove("hide");
    questionDivContainer.classList.remove("hide");
    formDivContainer.classList.remove("hide");
    currentQuestionIndex = -1;
    correctAnswerCount = 0;
    setNextQuestion();
  });
}

function setNextQuestion() {
  if (currentQuestionIndex === questions.length - 1) {
    // Preparing the ending text when the game is finished.
    endingTextDivContainer.classList.remove("hide");
    questionHeading.innerHTML = "Game finished!";
    endingText.innerHTML = `You have solved ${correctAnswerCount} out of ${questions.length} questions.`;
    nextInputButton.classList.add("hide");
    formDivContainer.classList.add("hide");
    restartInputButton.classList.remove("hide");
    restartInputButton.addEventListener("click", startGame);
    htmlBodyElement.className = "";
    htmlBodyElement.classList.add("neutral-color");

    // Preparing the history list.
    gameHistoryList.innerHTML = ""; // Clearing the innerHTML after each game.
    answersLogArray.forEach((item) => {
      let node;

      if (item.answer === item.userAnswer) {
        list = document.createElement("li");
        list.classList.add("correct-color-history");
        node = document.createTextNode(
          `${item.question} equal to ${item.userAnswer}`
        );
      } else {
        list = document.createElement("li");
        list.classList.add("wrong-color-history");
        node = document.createTextNode(
          `${item.question} does not equal to ${item.userAnswer} (correct answer: ${item.answer})`
        );
      }

      list.appendChild(node);
      gameHistoryList.appendChild(list);
    });
  } else {
    currentQuestionIndex++;
    resetQuestionState();
    showQuestion(questions[currentQuestionIndex]);
  }
}

function showQuestion(question) {
  questionHeading.innerHTML = `What is ${question.question}?`;
}

function processAnswer() {
  // Process an answer, we wouldn't need a event.preventDefault() because the whole thing isn't wrapped inside a form element.
  const currentQuestion = questions[currentQuestionIndex];

  if (!userInput.value) {
    // If the value is falsy.
    alert("Please input an answer!");
    return;
  } else if (parseInt(userInput.value) === currentQuestion.answer) {
    correctAnswerCount++;
    questionHeading.innerHTML = "You are correct!";
    htmlBodyElement.classList.add("correct-color");
  } else {
    questionHeading.innerHTML = `The correct answer is ${currentQuestion.answer}`;
    htmlBodyElement.classList.add("wrong-color");
  }
  answersLogArray.push({
    question: currentQuestion.question,
    answer: currentQuestion.answer,
    userAnswer: parseInt(userInput.value),
  });
  submitInputButton.classList.add("hide");
  nextInputButton.classList.remove("hide");
}

function resetQuestionState() {
  submitInputButton.classList.remove("hide");
  nextInputButton.classList.add("hide");
  restartInputButton.classList.add("hide");
  endingTextDivContainer.classList.add("hide");
  userInput.value = "";
  htmlBodyElement.className = "";
  htmlBodyElement.classList.add("neutral-color");
}
