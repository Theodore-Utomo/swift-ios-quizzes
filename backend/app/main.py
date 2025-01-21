from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI() ## Instantiates an app object that lets you make API Calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Quizzes = [
    {
        'name': 'Quiz: Ch. 1.1 - Xcode Tour & Text + Image Intro',
        'content': [
            {
                'question_number': 1,
                'question_type': 'MCQ',
                'question_text': 'How can you identify what an XCode toolbar icon does?',
                'question_options': [
                    'Ask Siri',
                    'Enter your question in the Object filter',
                    'Consult the Navigator pane',
                    'Hover your cursor over an icon so that a tooltip appears'
                ],
                'question_answer': 'Hover your cursor over an icon so that a tooltip appears'
            },
            {
                'question_number': 2,
                'question_type': 'MCQ',
                'question_text': 'I want to find my files inside Xcode - where do I look?',
                'question_options': [
                    'The Inspectors Pane',
                    'The Project Navigator Pane',
                    'The Standard Editor',
                    'The Scheme'
                ],
                'question_answer': 'The Project Navigator Pane'
            },
            {
                'question_number': 3,
                'question_type': 'MCQ',
                'question_text': 'The main file to click on to launch an Xcode project is named with the  _________ extension.',
                'question_options': [
                    '.xcode',
                    '.proj',
                    '.xcodeproj',
                    '.swift',
                    '.storyboard'
                ],
                'question_answer': 'The Project Navigator Pane'
            },
            {
                'question_number': 4,
                'question_type': 'MCQ_more_than_one',
                'question_text': 'Which of the following should you NOT do:',
                'question_options': [
                    'Move or copy your project folder with Xcode open.',
                    'Use the Finder to move project files from their saved locations inside your main project folder.',
                    'Rename project files in the Finder.',
                    'Make a copy of your top-level Xcode project folder.'
                ],
                'question_answer': [
                    'Move or copy your project folder with Xcode open.',
                    'Use the Finder to move project files from their saved locations inside your main project folder.',
                    'Rename project files in the Finder.'
                    ]
            },
            {
                'question_number': 5,
                'question_type': 'MCQ',
                'question_text': 'What is the name of the file containing the first View Xcode creates for a new project?',
                'question_options': [
                    'Project Navigator',
                    'ContentView',
                    'Attributes Inspector',
                    'Main.swift'
                ],
                'question_answer': 'ContentView'
            },
            {
                "question_number": 6,
                "question_type": "MCQ",
                "question_text": "A group of characters inside of double quotes is referred to as:",
                "question_options": [
                    "String",
                    "Text",
                    "Content",
                    "MarkUp",
                    "Comment"
                ],
                "question_answer": "String"
            },
            {
                "question_number": 7,
                "question_type": "MCQ",
                "question_text": "SwiftUI uses the term Content to describe any user interface element you'd see on screen, including Text, Buttons, Images, etc.",
                "question_options": [
                    "True",
                    "False"
                ],
                "question_answer": "False"
            },
            {
                "question_number": 8,
                "question_type": "MCQ",
                "question_text": "A function that changes a View is referred to as a:",
                "question_options": [
                    "element",
                    "attribute",
                    "data type",
                    "modifier"
                ],
                "question_answer": "modifier"
            },
            {
                "question_number": 9,
                "question_type": "MCQ_more_than_one",
                "question_text": "Dot notation can:",
                "question_options": [
                    "Show modifiers available for a particular view",
                    "Show the possible predefined values that can be passed in as a parameter input",
                    "Show a list of available Views"
                ],
                "question_answer": [
                    "Show modifiers available for a particular view",
                    "Show the possible predefined values that can be passed in as a parameter input"
                ]
            },
            {
                "question_number": 10,
                "question_type": "MCQ",
                "question_text": "I have an Image that is distorted and stretched out to the ends of the device. How can I fix this?",
                "question_options": [
                    ".scaledToFit()",
                    ".resizable()",
                    ".width()",
                    ".size()"
                ],
                "question_answer": ".scaledToFit()"
            },
            {
                "question_number": 11,
                "question_type": "MCQ",
                "question_text": "Apple has free resources on the web for Human Interface Guidelines that can provide all sorts of useful advice for designing effective apps and programs across the firm's various products.",
                "question_options": [
                    "True",
                    "False"
                ],
                "question_answer": "True"
            },
            {
                "question_number": 12,
                "question_type": "MCQ",
                "question_text": "How do I change the color of a systemImage?",
                "question_options": [
                    "rgb",
                    "color",
                    "foregroundStyle",
                    "backgroundColor"
                ],
                "question_answer": "foregroundStyle"
            },
            {
                "question_number": 13,
                "question_type": "MCQ",
                "question_text": "While typing a modifier, code completion shows the following at the end of the modifier: `-> Text`. What does this mean?",
                "question_options": [
                    "The modifier returns a String",
                    "The modifier returns a Text View",
                    "The modifier requires a Text value as an input to work",
                    "No answer text provided"
                ],
                "question_answer": "The modifier returns a Text View"
            }
        ]
    }
]

@app.get("/quizzes")
async def quiz() -> list[dict]:
    return Quizzes