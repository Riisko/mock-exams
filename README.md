# Mock Exam Website

This project is a simple website that allows users to create and take mock exams using JSON files. The website supports both single-choice and multiple-choice questions.

## Features
- Upload your own JSON file with questions and answers.
- Display questions with options.
- Support for single-choice and multiple-choice questions.
- Highlight correct and incorrect answers.
- Display the score at the top of the page.

## Instructions

### JSON File Structure
Prompt your favourite AI to create a JSON file for your mock exam, follow this structure:

```json
[
    {
        "question": "Your question text here",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "answer": ["Correct answer(s) here"],
        "multiple": false // or true for multiple-choice questions
    },
    {
        "question": "Another question text here",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "answer": ["Correct answer(s) here"],
        "multiple": false // or true for multiple-choice questions
    }
    // Add more questions as needed
]