const questions = [
    {
        q: "You reach the island and see three paths. Only one is safe. A board says: 'Choose the path that survivors take.' Which path do you choose?",
        options: ["Path with skeletons", "Path with fresh footprints", "Path with no footprints", "Path with animal bones"],
        answer: "Path with fresh footprints",
        hint: "Hint: Only living people leave *fresh* footprints.",
        img: "img2.jpg"
    },
    {
        q: "You find a locked door with a code: The clue says: 'Hungry Island has 3 tribes. Each tribe eats every 2 days. After 6 days, how many meals?'",
        options: ["3", "6", "9", "12"],
        answer: "9",
        hint: "Hint: In 6 days, each tribe eats 3 times (6 / 2 = 3). Multiply that by the number of tribes.",
        img: "img3.jpg"
    },
    {
        q: "A message says: 'Only even-numbered rocks are safe. The sum of rock numbers is 26.' Which pair is safe?",
        options: ["12 & 14", "10 & 4", "8 & 2", "7 & 5"],
        answer: "12 & 14",
        hint: "Hint: The sum must be 26 AND both numbers must be even. Check which pair satisfies both conditions.",
        img: "img4.jpg"
    },
    {
        q: "You find three idols: Idol of Teeth, Idol of Fire, Idol of Smoke. A prophecy says: 'Choose the one that saves you from hungryy peoples'",
        options: ["Teeth", "Fire", "Smoke", "All of them"],
        answer: "Fire",
        hint: "Hint: Choose the one that burns anything, which acts as a deterrent or signal.",
        img: "img5.jpg"
    },
    {
        q: "A cannibal island trap has three possible triggers: A feather, a stone, and a bone. Clue says: 'Pick the object they worship'",
        options: ["Feather", "Stone", "Bone", "None"],
        answer: "Bone",
        hint: "Hint: The object of worship is often related to the deceased or a captured animal - it's not a stone.",
        img: "img6.jpg"
    },
    {
        q: "A cannibal chant echoes: 'Two shadows walk, but only one is alive.' You see two shadows approaching. What should you do?",
        options: ["Run toward them", "Light a fire", "Hide behind rocks", "Shout for help"],
        answer: "Hide behind rocks",
        hint: "Hint: Don't reveal yourself, especially when you are unsure what is approaching.",
        img: "img7.jpg"
    },
    {
        q: "A stone puzzle says: 'Cannibals fear what they cannot see, but smell what is near.' Which tool helps you avoid them?",
        options: ["Torch", "Perfume", "Mud", "Sharp knife"],
        answer: "Mud",
        hint: "Hint: Mud is used to mask your natural scent. They find perfume smell attractive.",
        img: "img8.jpg"
    }
];

let currentQuestionIndex = 0;
const TOTAL_GAME_TIME = 10 * 60; // 10 minutes in seconds
const QUESTION_TIME = 10; // 10 seconds per question

let gameTimerId;
let questionTimerId;
let timeLeft = TOTAL_GAME_TIME;

// --- DOM Elements ---
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

const startGameBtn = document.getElementById('start-game-btn');
const gameTimerDisplay = document.getElementById('game-timer');
const questionTimerDisplay = document.getElementById('question-timer');

const questionText = document.getElementById('question-text');
const questionImage = document.getElementById('question-image');
const optionsContainer = document.getElementById('options-container');
const hintText = document.getElementById('hint-text');

const backgroundMusic = document.getElementById('background-music');
backgroundMusic.src = 'horror_music.mp3';

// --- Timer Functions ---

function updateGameTimer() {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    gameTimerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft <= 0) {
        clearInterval(gameTimerId);
        clearInterval(questionTimerId);
        endGame(false); // Game Over (Time Out)
    }
}

function startQuestionTimer() {
    let qTime = QUESTION_TIME;
    questionTimerDisplay.textContent = qTime;

    questionTimerId = setInterval(() => {
        qTime--;
        questionTimerDisplay.textContent = qTime;

        if (qTime <= 0) {
            clearInterval(questionTimerId);
            // Time's up, automatically show hint and proceed to next question logic (optional, but good for flow)
            displayHint();
            // In this version, we will just show the hint and keep the question until correctly answered.
        }
    }, 1000);
}

// --- Game Logic Functions ---

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        // All questions answered
        endGame(true);
        return;
    }

    const qData = questions[currentQuestionIndex];
    
    // Clear previous state
    clearInterval(questionTimerId);
    optionsContainer.innerHTML = '';
    hintText.style.display = 'none';

    // Set question and image
    questionText.textContent = `Q${currentQuestionIndex + 1}: ${qData.q}`;
    questionImage.src = qData.img;
    questionImage.alt = `Image for Question ${currentQuestionIndex + 1}`;

    // Create options
    qData.options.forEach(option => {
        const button = document.createElement('div');
        button.classList.add('option-btn');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(button, option, qData.answer, qData.hint));
        optionsContainer.appendChild(button);
    });
    
    // Start question timer for the new question
    startQuestionTimer();
}

function displayHint() {
    hintText.textContent = questions[currentQuestionIndex].hint;
    hintText.style.display = 'block';
}

function checkAnswer(clickedButton, selectedOption, correctAnswer, hint) {
    // Disable all buttons to prevent double-clicking
    document.querySelectorAll('.option-btn').forEach(btn => btn.style.pointerEvents = 'none');
    clearInterval(questionTimerId); // Pause question timer

    if (selectedOption === correctAnswer) {
        clickedButton.classList.add('correct');
        // Wait a moment for visual feedback, then proceed
        setTimeout(() => {
            currentQuestionIndex++;
            // Re-enable buttons before displaying next question
            document.querySelectorAll('.option-btn').forEach(btn => btn.style.pointerEvents = 'auto');
            displayQuestion();
        }, 800);
    } else {
        clickedButton.classList.add('incorrect');
        // Show hint immediately
        displayHint();
        
        // After showing the result/hint, re-enable buttons
        setTimeout(() => {
            clickedButton.classList.remove('incorrect');
            document.querySelectorAll('.option-btn').forEach(btn => btn.style.pointerEvents = 'auto');
            // Restart question timer for another attempt
            startQuestionTimer();
        }, 1000); 
    }
}

function startGame() {
    introScreen.classList.remove('active');
    gameScreen.classList.add('active');

    // Start background music
    backgroundMusic.play();
    
    // Start main game timer
    gameTimerId = setInterval(updateGameTimer, 1000);

    // Load first question
    displayQuestion();
}

function endGame(success) {
    gameScreen.classList.remove('active');
    endScreen.classList.add('active');
    
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Rewind the music

    const endMessage = document.getElementById('end-message');
    
    if (success) {
        endMessage.textContent = "CONGRATULATIONS! YOU ESCAPED THE ISLAND!";
    } else {
        endMessage.textContent = "TIME'S UP! YOU DIDN'T ESCAPE...";
        document.querySelector('.final-riddle').style.display = 'none'; // Hide riddle on loss
    }
}

// --- Initialization ---

startGameBtn.addEventListener('click', startGame);
gameTimerDisplay.textContent = '10:00'; // Set initial display
