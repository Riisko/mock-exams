// ===== START: Night Mode Logic =====

// Select the theme switch checkbox
const themeSwitch = document.getElementById('themeSwitch');
const htmlElement = document.documentElement; // Target the <html> element

// Function to set the theme
const setTheme = (theme) => {
    htmlElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme); // Save preference
    // Update switch state (checked if dark)
    if (themeSwitch) {
       themeSwitch.checked = (theme === 'dark');
    }
};

// Function to toggle the theme
const toggleTheme = () => {
    const currentTheme = htmlElement.getAttribute('data-bs-theme') || 'light'; // Default to light if unset
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
};

// --- Initialization ---
// 1. Check localStorage for saved theme preference on page load
const savedTheme = localStorage.getItem('theme');

// 2. Check OS preference if no theme saved
//    (prefers-color-scheme: dark) evaluates to true if the user wants dark mode
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// 3. Determine the initial theme
//    Priority: Saved Theme > OS Preference > Default (Light)
let initialTheme = 'light'; // Default
if (savedTheme) {
    initialTheme = savedTheme;
} else if (prefersDark) {
    initialTheme = 'dark';
}

// 4. Apply the initial theme *immediately*
setTheme(initialTheme);

// --- Event Listener ---
// Add event listener to the switch *after* the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Re-select the switch in case the script runs before the element exists
    const themeSwitchElement = document.getElementById('themeSwitch');
    if (themeSwitchElement) {
        // Set initial check state correctly based on the theme already applied
        themeSwitchElement.checked = (htmlElement.getAttribute('data-bs-theme') === 'dark');

        // Add the listener
        themeSwitchElement.addEventListener('change', toggleTheme);
    } else {
        console.warn("Theme switch element not found.");
    }
});


// ===== END: Night Mode Logic =====


// ===== Your Existing JavaScript =====

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const questions = JSON.parse(e.target.result);
                displayQuestions(questions);
                // Make sure the button exists before assigning onclick
                const submitButton = document.querySelector('button[type="submit"], button:not([type])'); // More specific selector
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
        questionDiv.className = 'question mb-3 p-3 rounded'; // Add padding/rounding for better visual feedback

        // 2. Create the paragraph element for the question text
        const questionP = document.createElement('p');
        questionP.className = 'fw-bold'; // Make question text bold
        questionP.textContent = `${index + 1}. ${q.question}`;
        questionDiv.appendChild(questionP); // Add paragraph to the question div

        // 3. Create and add options using labels and inputs
        q.options.forEach((option, i) => {
             // Create container for each option for better structure
            const optionDiv = document.createElement('div');
            optionDiv.className = 'form-check mb-2'; // Bootstrap class for styling radio/checkbox

            const inputId = `question${index}_option${i}`;

            // Create the input element (radio or checkbox)
            const input = document.createElement('input');
            input.className = 'form-check-input';
            input.type = q.multiple ? 'checkbox' : 'radio';
            input.name = `question${index}`; // Group radios/checkboxes
            input.id = inputId;
            input.value = option; // Assign the option string directly

             // Create the label element
            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.htmlFor = inputId; // Link label to input for accessibility

            // Create a text node for the option text.
            const optionTextNode = document.createTextNode(option); // No extra space needed with form-check structure

            // Append input and text node to the label
            label.appendChild(optionTextNode);

            // Append input and label to the optionDiv
            optionDiv.appendChild(input);
            optionDiv.appendChild(label);

            // Append the optionDiv to the main question div
            questionDiv.appendChild(optionDiv);
        });

        // 4. Append the fully constructed question div to the main container
        questionsContainer.appendChild(questionDiv);
    });

     // Ensure the Submit button is visible *after* questions are displayed
     const submitButton = document.querySelector('button[type="submit"], button:not([type])');
     if (submitButton) {
        submitButton.style.display = 'block'; // Or 'inline-block' etc.
     }
     const scoreElement = document.getElementById('score');
     if(scoreElement) {
        scoreElement.innerHTML = ''; // Clear previous score
     }
}

function submitExam(questions) {
    let score = 0;
    // Ensure questions container exists before querying inside it
    const questionsContainer = document.getElementById('questions');
    if (!questionsContainer) return;

    questions.forEach((q, index) => {
        // Find the corresponding question div to apply styling
        // Querying within questionsContainer is safer
        const questionDiv = questionsContainer.querySelector(`.question:nth-child(${index + 1})`);

        // Get selected options for this question
        const selectedInputs = questionDiv ? questionDiv.querySelectorAll(`input[name="question${index}"]:checked`) : [];
        const selectedOptions = Array.from(selectedInputs).map(input => input.value);

        // Remove previous result classes before adding new ones
        if (questionDiv) {
            questionDiv.classList.remove('correct', 'wrong'); // Remove both classes

            // Ensure q.answer is always an array, even for single-answer questions
            const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];

            // Sort both arrays for consistent comparison
            if (arraysEqual(selectedOptions.sort(), correctAnswers.sort())) {
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
        scoreElement.innerText = `You scored ${score} out of ${questions.length}: ${score/questions.length*100}%`;
    }

    // Scrolls to the top-left corner of the page smoothly.
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Helper function to compare arrays (order doesn't matter due to sorting before call)
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        // Use strict equality (===)
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}