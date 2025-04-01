document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const questions = JSON.parse(e.target.result);
                displayQuestions(questions);
                // Make sure the button exists before assigning onclick
                const submitButton = document.querySelector('button');
                if (submitButton) {
                    submitButton.onclick = function() {
                        submitExam(questions);
                    };
                } else {
                    console.error("Submit button not found.");
                }
            } catch (error) {
                console.error("Error parsing JSON file:", error);
                // Optionally display an error to the user
                document.getElementById('questions').textContent = 'Error: Could not load or parse the questions file.';
            }
        };
        reader.onerror = function() {
            console.error("Error reading file:", reader.error);
            document.getElementById('questions').textContent = 'Error: Could not read the questions file.';
        }
        reader.readAsText(file);
    }
});

function displayQuestions(questions) {
    const questionsContainer = document.getElementById('questions');
    questionsContainer.innerHTML = ''; // Clear previous questions

    questions.forEach((q, index) => {
        // 1. Create the main container div for the question
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question mb-3'; // Add spacing

        // 2. Create the paragraph element for the question text
        const questionP = document.createElement('p');
        // Use textContent here - it's safe as question text usually doesn't contain HTML
        questionP.textContent = `${index + 1}. ${q.question}`;
        questionDiv.appendChild(questionP); // Add paragraph to the question div

        // 3. Create and add options using labels and inputs
        q.options.forEach((option, i) => {
            // Create the label element
            const label = document.createElement('label');
            label.className = 'form-check-label d-block p-2'; // Style the label
            const inputId = `question${index}_option${i}`;
            label.htmlFor = inputId; // Link label to input for accessibility

            // Create the input element (radio or checkbox)
            const input = document.createElement('input');
            input.className = 'form-check-input';
            input.type = q.multiple ? 'checkbox' : 'radio';
            input.name = `question${index}`; // Group radios/checkboxes
            input.id = inputId;
            // Assign the option string directly to the value property
            input.value = option;

            // *** THE KEY FIX ***
            // Create a text node for the option text. This prevents HTML interpretation.
            // We add a space before the option text for better spacing after the input button.
            const optionTextNode = document.createTextNode(` ${option}`);

            // Append the input AND the text node to the label
            label.appendChild(input);
            label.appendChild(optionTextNode);

            // Append the complete label (with input and text) to the question div
            questionDiv.appendChild(label);
        });

        // 4. Append the fully constructed question div to the main container
        questionsContainer.appendChild(questionDiv);
    });
}

function submitExam(questions) {
    let score = 0;
    // Ensure questions container exists before querying inside it
    const questionsContainer = document.getElementById('questions');
    if (!questionsContainer) return;

    questions.forEach((q, index) => {
        // Get selected options for this question
        const selectedInputs = questionsContainer.querySelectorAll(`input[name="question${index}"]:checked`);
        const selectedOptions = Array.from(selectedInputs).map(input => input.value);

        // Find the corresponding question div to apply styling
        // Querying within questionsContainer is safer if elements get added/removed elsewhere
        const questionDiv = questionsContainer.querySelector(`.question:nth-child(${index + 1})`);

        // Remove previous result classes before adding new ones
        if (questionDiv) {
            questionDiv.classList.remove('correct', 'wrong');

            if (arraysEqual(selectedOptions.sort(), q.answer.sort())) { // Sort arrays for consistent comparison
                score++;
                questionDiv.classList.add('correct');
            } else {
                questionDiv.classList.add('wrong');
            }
        }
    });

    // Display the score
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerText = `You scored ${score} out of ${questions.length}`;
    }
}

// Helper function to compare arrays (order might matter depending on use case)
// Updated to handle cases where order doesn't matter by sorting first in submitExam
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    // Create copies before sorting if original order is needed elsewhere
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
            return false;
        }
    }
    return true;
}