document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const questions = JSON.parse(e.target.result);
            displayQuestions(questions);
            document.querySelector('button').onclick = function() {
                submitExam(questions);
            };
        };
        reader.readAsText(file);
    }
});

function displayQuestions(questions) {
    const questionsContainer = document.getElementById('questions');
    questionsContainer.innerHTML = ''; // Clear previous questions
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question mb-3';
        questionDiv.innerHTML = `
            <p>${index + 1}. ${q.question}</p>
            ${q.options.map((option, i) => `
                <label class="form-check-label d-block p-2" for="question${index}_option${i}">
                    <input class="form-check-input" type="${q.multiple ? 'checkbox' : 'radio'}" name="question${index}" id="question${index}_option${i}" value="${option}">
                    ${option}
                </label>
            `).join('')}
        `;
        questionsContainer.appendChild(questionDiv);
    });
}

function submitExam(questions) {
    let score = 0;
    questions.forEach((q, index) => {
        const selectedOptions = Array.from(document.querySelectorAll(`input[name="question${index}"]:checked`)).map(input => input.value);
        const questionDiv = document.querySelector(`.question:nth-child(${index + 1})`);
        if (arraysEqual(selectedOptions, q.answer)) {
            score++;
            questionDiv.classList.add('correct');
        } else {
            questionDiv.classList.add('wrong');
        }
    });
    document.getElementById('score').innerText = `You scored ${score} out of ${questions.length}`;
}

function arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every(value => arr2.includes(value));
}