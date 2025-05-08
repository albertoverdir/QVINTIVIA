// Variables globales del juego
let questions = []; // Almacena todas las preguntas y respuestas
let currentQuestionIndex = 0; // Índice de la pregunta actual
let teamATurn = true; // true = turno equipo A, false = equipo B
let teamAScore = 0;
let teamBScore = 0;
let teamAFails = 0;
let teamBFails = 0;
let revealedAnswers = 0; // Contador de respuestas reveladas

// Elementos del DOM
const setupSection = document.getElementById('setup-game');
const gamePlaySection = document.getElementById('game-play');
const gameEndSection = document.getElementById('game-end');
const questionInput = document.getElementById('question');
const answerInputs = document.querySelectorAll('.answer-input');
const addQuestionBtn = document.getElementById('add-question');
const startGameBtn = document.getElementById('start-game');
const questionCountDisplay = document.getElementById('question-count');
const currentQuestionDisplay = document.getElementById('current-question');
const answersGrid = document.querySelector('.answers-grid');
const playerAnswerInput = document.getElementById('player-answer');
const submitAnswerBtn = document.getElementById('submit-answer');
const currentTeamDisplay = document.getElementById('current-team');
const teamAScoreDisplay = document.querySelector('#team-a .score');
const teamBScoreDisplay = document.querySelector('#team-b .score');
const failBoxes = document.querySelectorAll('.fail-box');
const stealSection = document.getElementById('steal-section');
const stealAnswerInput = document.getElementById('steal-answer');
const submitStealBtn = document.getElementById('submit-steal');
const opponentTeamDisplay = document.getElementById('opponent-team');
const playAgainBtn = document.getElementById('play-again');
const finalMessage = document.getElementById('final-message');

// Elementos de audio (comentados - insertar archivos de sonido)
// const correctSound = document.getElementById('correct-sound');
// const wrongSound = document.getElementById('wrong-sound');
// const stealSound = document.getElementById('steal-sound');

// Inicialización del juego
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners
    addQuestionBtn.addEventListener('click', addQuestion);
    startGameBtn.addEventListener('click', startGame);
    submitAnswerBtn.addEventListener('click', checkAnswer);
    submitStealBtn.addEventListener('click', checkStealAttempt);
    playAgainBtn.addEventListener('click', resetGame);
});

// Función para agregar una pregunta al juego
function addQuestion() {
    const questionText = questionInput.value.trim();
    const answers = Array.from(answerInputs).map(input => input.value.trim()).filter(answer => answer !== '');
    
    if (questionText === '') {
        alert('Por favor ingresa una pregunta');
        return;
    }
    
    if (answers.length < 5) {
        alert('Debes ingresar al menos 5 respuestas');
        return;
    }
    
    questions.push({
        question: questionText,
        answers: answers
    });
    
    // Limpiar los inputs
    questionInput.value = '';
    answerInputs.forEach(input => input.value = '');
    
    // Actualizar contador
    questionCountDisplay.textContent = `Preguntas agregadas: ${questions.length}`;
    
    // Enfocar el campo de pregunta para la siguiente
    questionInput.focus();
}

// Función para iniciar el juego
function startGame() {
    if (questions.length === 0) {
        alert('Debes agregar al menos una pregunta para comenzar');
        return;
    }
    
    // Ocultar sección de configuración y mostrar juego
    setupSection.classList.add('hidden');
    gamePlaySection.classList.remove('hidden');
    
    // Mostrar la primera pregunta
    showQuestion(0);
}

// Función para mostrar una pregunta
function showQuestion(index) {
// Asegurarse que el formulario de respuesta esté habilitado
document.querySelector('.answer-form').classList.remove('disabled');

    if (index >= questions.length) {
        endGame();
        return;
    }
    
    currentQuestionIndex = index;
    const currentQuestion = questions[index];
    
    // Mostrar la pregunta
    currentQuestionDisplay.textContent = currentQuestion.question;
    
    // Limpiar respuestas anteriores
    answersGrid.innerHTML = '';
    
    // Crear cajas de respuesta
    currentQuestion.answers.forEach((answer, i) => {
        const answerBox = document.createElement('div');
        answerBox.className = 'answer-box';
        answerBox.dataset.answer = answer.toLowerCase();
        answerBox.dataset.points = 20; // 20 puntos por respuesta
        answerBox.dataset.placeholder = `Respuesta ${i+1}`;
        answersGrid.appendChild(answerBox);
    });
    
    // Reiniciar contadores de errores
    teamAFails = 0;
    teamBFails = 0;
    updateFailDisplay();
    revealedAnswers = 0;
    
    // Reiniciar sección de robo
    stealSection.classList.add('hidden');
    stealAnswerInput.value = '';
    
    // Reiniciar input de respuesta
    playerAnswerInput.value = '';
    playerAnswerInput.focus();
}

// Función para verificar la respuesta del jugador
function checkAnswer() {
    const playerAnswer = playerAnswerInput.value.trim().toLowerCase();
    if (playerAnswer === '') {
        alert('Por favor ingresa una respuesta');
        return;
    }
    
    const answerBoxes = document.querySelectorAll('.answer-box:not(.revealed)');
    let answerFound = false;
    
    answerBoxes.forEach(box => {
        const correctAnswer = box.dataset.answer;
        
        if (playerAnswer === correctAnswer) {
            answerFound = true;
            box.textContent = correctAnswer;
            box.classList.add('revealed');
            
            const points = parseInt(box.dataset.points);
            if (teamATurn) {
                teamAScore += points;
                teamAScoreDisplay.textContent = `${teamAScore} puntos`;
            } else {
                teamBScore += points;
                teamBScoreDisplay.textContent = `${teamBScore} puntos`;
            }
            
            revealedAnswers++;
            
            // Reproducir sonido de acierto
            // correctSound.play();
        }
    });
    
    if (answerFound) {
        playerAnswerInput.value = '';
        
        // Cambiado para esperar exactamente 5 respuestas
        if (revealedAnswers === 5) {
            setTimeout(() => {
                showQuestion(currentQuestionIndex + 1);
            }, 2000);
        }
    } else {
        handleWrongAnswer();
    }
}
    
    // Verificar cada respuesta no revelada
    answerBoxes.forEach(box => {
        const correctAnswer = box.dataset.answer;
        
        if (playerAnswer === correctAnswer) {
            answerFound = true;
            box.textContent = correctAnswer;
            box.classList.add('revealed');
            
            const points = parseInt(box.dataset.points);
            if (teamATurn) {
                teamAScore += points;
                teamAScoreDisplay.textContent = `${teamAScore} puntos`;
            } else {
                teamBScore += points;
                teamBScoreDisplay.textContent = `${teamBScore} puntos`;
            }
            
            revealedAnswers++;
            
            // Reproducir sonido de acierto (descomentar cuando tengas el archivo)
            // correctSound.play();
            
            // Verificar si todas las respuestas fueron reveladas
            if (revealedAnswers === answerBoxes.length) {
                setTimeout(() => {
                    showQuestion(currentQuestionIndex + 1);
                }, 2000);
            }
        }
    });
    
    if (answerFound) {
        playerAnswerInput.value = '';
    } else {
        // Respuesta incorrecta
        handleWrongAnswer();
    }

// Función para manejar respuesta incorrecta
function handleWrongAnswer() {
    // Reproducir sonido de error
    // wrongSound.play();
    
    if (teamATurn) {
        teamAFails++;
    } else {
        teamBFails++;
    }
    
    updateFailDisplay();
    
    // Verificar si el equipo ha alcanzado 3 errores
    if ((teamATurn && teamAFails >= 3) || (!teamATurn && teamBFails >= 3)) {
         // Deshabilitar el formulario de respuesta
        document.querySelector('.answer-form').classList.add('disabled');
        // Habilitar robo para el equipo contrario
        stealSection.classList.remove('hidden');
        opponentTeamDisplay.textContent = teamATurn ? 'B' : 'A';
        stealAnswerInput.focus();
        
        // Reproducir sonido de robo
        // stealSound.play();
    }
    // NO cambiamos de turno aquí, el equipo sigue jugando hasta 3 errores
    
    playerAnswerInput.value = '';
}

// Función para actualizar la visualización de errores
function updateFailDisplay() {
    failBoxes.forEach((box, i) => {
        if (teamATurn) {
            box.dataset.team = 'a';
            box.textContent = i < teamAFails ? 'X' : '';
            box.classList.toggle('failed', i < teamAFails);
        } else {
            box.dataset.team = 'b';
            box.textContent = i < teamBFails ? 'X' : '';
            box.classList.toggle('failed', i < teamBFails);
        }
    });
}

// Función para cambiar de turno
function switchTurn() {
    teamATurn = !teamATurn;
    currentTeamDisplay.textContent = teamATurn ? 'Equipo A' : 'Equipo B';
    playerAnswerInput.focus();
}

// Función para verificar el intento de robo
function checkStealAttempt() {
    // Habilitar el formulario de respuesta nuevamente
    document.querySelector('.answer-form').classList.remove('disabled');
    //Activación del robo
    const stealAnswer = stealAnswerInput.value.trim().toLowerCase();
    if (stealAnswer === '') {
        alert('Por favor ingresa una respuesta');
        return;
    }
    
    const answerBoxes = document.querySelectorAll('.answer-box:not(.revealed)');
    let answerFound = false;
    
    answerBoxes.forEach(box => {
        const correctAnswer = box.dataset.answer;
        
        if (stealAnswer === correctAnswer) {
            answerFound = true;
            box.textContent = correctAnswer;
            box.classList.add('revealed');
            
            // Calcular puntos que el equipo original había ganado en ESTA pregunta
            const originalTeamPoints = Array.from(document.querySelectorAll('.answer-box.revealed'))
                .reduce((total, box) => total + parseInt(box.dataset.points), 0);
            
            // Solo transferir los puntos que el equipo original había ganado
            if (!teamATurn) { // Equipo A roba al B
                teamAScore += originalTeamPoints;
                teamBScore -= originalTeamPoints;
                teamBScore = Math.max(0, teamBScore); // No permitir puntaje negativo
                teamAScoreDisplay.textContent = `${teamAScore} puntos`;
                teamBScoreDisplay.textContent = `${teamBScore} puntos`;
            } else { // Equipo B roba al A
                teamBScore += originalTeamPoints;
                teamAScore -= originalTeamPoints;
                teamAScore = Math.max(0, teamAScore); // No permitir puntaje negativo
                teamBScoreDisplay.textContent = `${teamBScore} puntos`;
                teamAScoreDisplay.textContent = `${teamAScore} puntos`;
            }
        }
    });
    
    // Revelar todas las respuestas restantes
    document.querySelectorAll('.answer-box:not(.revealed)').forEach(remainingBox => {
        remainingBox.textContent = remainingBox.dataset.answer;
        remainingBox.classList.add('revealed');
        remainingBox.style.color = '#F8B55F';
        remainingBox.style.fontFamily = "'Limelight', cursive";
    });
    
    revealedAnswers = 5;
    
    if (answerFound) {
        // correctSound.play();
    } else {
        // wrongSound.play();
        // Si no acierta el robo, los puntos se quedan como estaban
    }
    
    // Pasar a la siguiente pregunta y cambiar de turno
    setTimeout(() => {
        switchTurn();
        showQuestion(currentQuestionIndex + 1);
    }, 1500);
}

// Función para terminar el juego
function endGame() {
    gamePlaySection.classList.add('hidden');
    gameEndSection.classList.remove('hidden');
    
    let winnerMessage;
    if (teamAScore > teamBScore) {
        winnerMessage = `¡El equipo A gana con ${teamAScore} puntos!`;
    } else if (teamBScore > teamAScore) {
        winnerMessage = `¡El equipo B gana con ${teamBScore} puntos!`;
    } else {
        winnerMessage = `¡Empate! Ambos equipos tienen ${teamAScore} puntos.`;
    }
    
    finalMessage.textContent = winnerMessage;
}

// Función para reiniciar el juego
function resetGame() {
    // Reiniciar variables
    currentQuestionIndex = 0;
    teamATurn = true;
    teamAScore = 0;
    teamBScore = 0;
    teamAFails = 0;
    teamBFails = 0;
    
    // Actualizar displays
    currentTeamDisplay.textContent = 'Equipo A';
    teamAScoreDisplay.textContent = '0 puntos';
    teamBScoreDisplay.textContent = '0 puntos';
    updateFailDisplay();
    
    // Volver a la pantalla de juego
    gameEndSection.classList.add('hidden');
    gamePlaySection.classList.remove('hidden');
    
    // Mostrar la primera pregunta
    showQuestion(0);
}