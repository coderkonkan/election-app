// --- Data ---
const quizData = [
    {
        question: "What is the primary requirement for a person to register to vote in most countries?",
        options: ["Owning property", "Citizenship and reaching a certain age", "Having a high school diploma", "Paying a poll tax"],
        correct: 1
    },
    {
        question: "During which stage do candidates explain their policies to the public?",
        options: ["Voter Registration", "Campaigning", "Counting", "Certification"],
        correct: 1
    },
    {
        question: "What is a 'Secret Ballot'?",
        options: ["A vote that is never counted", "A vote cast in private to prevent intimidation", "A vote only known by the President", "A vote cast by mail only"],
        correct: 1
    },
    {
        question: "Who is responsible for counting the votes after an election?",
        options: ["The winning candidate", "The military", "Official election officials and observers", "The media"],
        correct: 2
    },
    {
        question: "Why is Voter Registration important?",
        options: ["To collect taxes", "To ensure only eligible people vote", "To choose the winner early", "To make it harder to vote"],
        correct: 1
    }
];

let currentVotes = {
    'Candidate A': 0,
    'Candidate B': 0,
    'Candidate C': 0
};

let currentQuestionIndex = 0;
let score = 0;

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    initGravityEffect();
    initProcessCards();
    updateVoteUI();
    renderQuestion();
    
    // Add reset listener
    document.getElementById('reset-votes').addEventListener('click', resetVotes);
});

// --- Gravity Engine ---
function initGravityEffect() {
    const cards = document.querySelectorAll('.gravity-card');
    
    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        
        // Update root variables for CSS to use
        document.documentElement.style.setProperty('--mouse-x', `${x}deg`);
        document.documentElement.style.setProperty('--mouse-y', `${-y}deg`);
        
        // Add a subtle parallax to the background too
        const bgShiftX = (e.pageX / window.innerWidth) * 20;
        const bgShiftY = (e.pageY / window.innerHeight) * 20;
        document.body.style.backgroundPosition = `${bgShiftX}px ${bgShiftY}px`;
    });
}

// --- Election Process Module ---
function initProcessCards() {
    const cards = document.querySelectorAll('.gravity-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle active state
            card.classList.toggle('active');
            
            // Close others (Optional: Accordion style)
            // cards.forEach(c => { if(c !== card) c.classList.remove('active'); });
        });
    });
}

// --- Voting Simulation ---
function castVote(candidate) {
    currentVotes[candidate]++;
    updateVoteUI();
    
    // Simple feedback effect
    const btn = event.currentTarget.querySelector('.vote-btn');
    const originalText = btn.innerText;
    btn.innerText = "Voted! ✅";
    btn.style.background = "#22c55e";
    
    setTimeout(() => {
        btn.innerText = "Vote Again";
        btn.style.background = "var(--primary)";
    }, 1000);
}

function updateVoteUI() {
    const container = document.getElementById('vote-bars');
    container.innerHTML = '';
    
    const totalVotes = Object.values(currentVotes).reduce((a, b) => a + b, 0);
    
    for (const [candidate, count] of Object.entries(currentVotes)) {
        const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
        
        const barHtml = `
            <div class="vote-bar-container">
                <div class="label-group">
                    <span>${candidate}</span>
                    <span>${count} votes (${percentage}%)</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        container.innerHTML += barHtml;
    }
}

function resetVotes() {
    currentVotes = { 'Candidate A': 0, 'Candidate B': 0, 'Candidate C': 0 };
    updateVoteUI();
}

// --- Quiz Module ---
function renderQuestion() {
    const question = quizData[currentQuestionIndex];
    document.getElementById('question-count').innerText = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    document.getElementById('progress-fill').style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
    
    document.getElementById('question-text').innerText = question.question;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((opt, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerText = opt;
        button.onclick = () => handleAnswer(index, button);
        optionsContainer.appendChild(button);
    });
}

function handleAnswer(selectedIndex, button) {
    const question = quizData[currentQuestionIndex];
    const allButtons = document.querySelectorAll('.option-btn');
    
    // Disable all buttons after selection
    allButtons.forEach(btn => btn.style.pointerEvents = 'none');
    
    if (selectedIndex === question.correct) {
        button.classList.add('correct');
        score++;
    } else {
        button.classList.add('wrong');
        allButtons[question.correct].classList.add('correct');
    }
    
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            renderQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    document.getElementById('question-box').classList.add('hidden');
    document.getElementById('quiz-header').classList.add('hidden');
    document.getElementById('quiz-results').classList.remove('hidden');
    document.getElementById('final-score').innerText = score;
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('question-box').classList.remove('hidden');
    document.getElementById('quiz-header').classList.remove('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    renderQuestion();
}

// Intercept clicks on candidate cards to cast votes
window.castVote = castVote;
window.resetQuiz = resetQuiz;
