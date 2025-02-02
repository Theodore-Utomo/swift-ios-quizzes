Quizzes = [
    {
        'id': 1,
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
                'question_answer': '.xcodeproj'
            },
            {
                'question_number': 4,
                'question_type': 'Multiple_answer',
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
                "question_type": "Multiple_answer",
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
    },
    {
        'id': 2,
        'name': 'Quiz Ch. 1.2. SwiftUI: Print, Buttons, Our First Var, and What the Heck is @State?',
        'content': [
            {
                'question_number': 1,
                'question_type': 'Multiple_answer',
                'question_text': 'What does one do when they declare a variable?',
                'question_options': [
                    'Create the holding space for a type of data',
                    'Initialize the variable so that it contains data',
                    'Give the variable a name',
                    'Equate a value to a literal value'
                ],
                'question_answer': [
                    'Create the holding space for a type of data',
                    'Give the variable a name'
                ]
            },
            {
                "question_number": 2,
                "question_type": "MCQ",
                "question_text": "Which command can I use in front of a variable declaration to allow that variable to hold its value even as a View is destroyed and recreated?",
                "question_options": [
                    "private",
                    "let",
                    "struct",
                    "@State",
                    ".mutable"
                ],
                "question_answer": "@State"
            },
            {
                "question_number": 3,
                "question_type": "MCQ",
                "question_text": "SwiftUI will redraw a View if the value of data that a View is dependent on changes.",
                "question_options": [
                    "True",
                    "False"
                ],
                "question_answer": "True"
            },
            {
                "question_number": 4,
                "question_type": "MCQ",
                "question_text": "In Swift, a closure is written between parentheses.",
                "question_options": [
                    "True",
                    "False"
                ],
                "question_answer": "False"
            },
            {
                "question_number": 5,
                "question_type": "Multiple_answer",
                "question_text": "Select all of the answers that are true for the statement shown below: var myString = 'Hi, Developer!'",
                "question_options": [
                    "the variable is declared",
                    "the variable is initialized",
                    "the variable is named myString",
                    "the variable contains 'Hi, Developer!'",
                    "the variable contains a String"
                ],
                "question_answer": [
                    "the variable is declared",
                    "the variable is initialized",
                    "the variable is named myString",
                    "the variable contains 'Hi, Developer!'",
                    "the variable contains a String"
                ]
            }
        ]
    },
    {
        'id': 3,
        'name': 'Quiz Ch. 1.3. SwiftUI: Button Styles, Spacers, Frames, & Optional Parameters (2025) - 12:50',
        'content': [
            {
                'question_number': 1,
                'question_type': "Multiple_answer",
                'question_text': 'Which of these statements are true?',
                'question_options': [
                    'Constants are defined using “var”.',
                    'Constants are only used for numerical types.',
                    'Constants are immutable once defined.',
                    'Constants slow down your code.'
                ],
                'question_answer': [
                    'Constants are immutable once defined.'
                ]
            },
            {
                "question_number": 2,
                "question_type": "MCQ",
                "question_text": "You can bring up a context menu, which has options available for a particular item in your code, by:",
                "question_options": [
                    "Clicking the item's name",
                    "Option-clicking the item's name",
                    "Command-clicking the item's name",
                    "Shift-clicking the item's name",
                    "Right-clicking (two-finger clicking) the item's name"
                ],
                "question_answer": "Right-clicking (two-finger clicking) the item's name"
            },
            {
                "question_number": 3,
                "question_type": "MCQ",
                "question_text": "If you enter three spacers, two above a View and one below a View...",
                "question_options": [
                    "The first Spacer will take up all of the available space",
                    "The last Spacer will take up all of the available space",
                    "Each Spacer will take up 1/3 of the available space"
                ],
                "question_answer": "Each Spacer will take up 1/3 of the available space"
            },
            {
                "question_number": 4,
                "question_type": "MCQ",
                "question_text": "To change the color of a .borderProminent button, use the modifier: .foregroundStyle.",
                "question_options": [
                    "True",
                    "False"
                ],
                "question_answer": "False"
            },
            {
                "question_number": 5,
                "question_type": "MCQ",
                "question_text": "If I have an HStack that contains two buttons, followed by a Spacer, what is the result?",
                "question_options": [
                    "The buttons are centered",
                    "The buttons are left justified",
                    "The buttons are right justified",
                    "Each button is pushed to the ends of the screen, with a large space between them"
                ],
                "question_answer": "The buttons are left justified"
            },
            {
                "question_number": 5,
                "question_type": "MCQ",
                "question_text": "I am entering a modifier. The modifier's name is highlighted and I can see that it has three optional parameters. I'd like to have code completion enter all three parameters. What do I do?",
                "question_options": [
                    "Press Tab",
                    "Press Return",
                    "Press up arrow",
                    "Press down arrow",
                    "Hold down option while pressing Return"
                ],
                "question_answer": "Hold down option while pressing Return"
            },
            {
                "question_number": 6,
                "question_type": "MCQ",
                "question_text": "In code completion, if you'd like to select optional parameters, you can type the first few characters of each option until it becomes highlighted in your selection. You can do this to select multiple, optional parameters.",
                "question_options": [
                    "True",
                    "False"
                ],
                "question_answer": "True"
            }
        ]
    },
    {
        'id': 4,
        'name': 'Quiz Ch. 1.4. Xcode Playground, Print 3 Ways in Swift, plus an intro to Conditionals (2025)',
        'content': [
            {
                "question_number": 1,
                "question_type": "MCQ",
                "question_text": "An Xcode Playground is the main interface used to build full iOS apps.",
                "question_options": [
                    "True",
                    "False"
                ],
                "question_answer": "False"
            },
            {
                "question_number": 2,
                "question_type": "MCQ",
                "question_text": "What is the shortcut key that you can type at the end of a line of Playground code to execute the code and show results in the Debug Pane / Console area?",
                "question_options": [
                    "Return",
                    "Shift Return",
                    "Command Return",
                    "Option Return",
                    "CTRL Return"
                ],
                "question_answer": "Shift Return"
            },
            {
                "question_number": 3,
                "question_type": "MCQ",
                "question_text": "Assuming otherString is a String variable, which of the following will generate an error?",
                "question_options": [
                    "print(\"Hello \" + otherString)",
                    "print(\"Hello\" otherString)",
                    "print(\"Hello \\\(otherString)\")",
                    "print(\"Hello\", otherString)"
                ],
                "question_answer": "print(\"Hello\" otherString)"
            },
            {
                "question_number": 4,
                "question_type": "MCQ",
                "question_text": "What is the output of this code?\n\nvar name = \"John\"\nif name == \"Charles\" {\nprint(\"Hello, Your Majesty\")\n} else if name == \"Kate\" {\nprint(\"Hello, Princess\")\n} else if name == \"William\" {\nprint(\"Hello, Prince\")\n} else {\nprint(\"Hello, \\\(name)\")\n}",
                "question_options": [
                    "Hello, Your Majesty",
                    "Hello, Princess",
                    "Hello, Prince",
                    "Hello, John",
                    "Hello"
                ],
                "question_answer": "Hello, John"
            },
            {
                "question_number": 5,
                "question_type": "MCQ",
                "question_text": "What is the output of this code?\n\nvar name = \"kate\"\nif name == \"Charles\" {\nprint(\"Hello, Your Majesty\")\n} else if name == \"Kate\" {\nprint(\"Hello, Princess\")\n} else if name == \"William\" {\nprint(\"Hello, Prince\")\n} else {\nprint(\"Hello, \\\(name)\")\n}",
                "question_options": [
                    "Hello, Your Majesty",
                    "Hello, Princess",
                    "Hello, Prince",
                    "Hello, kate",
                    "Hello"
                ],
                "question_answer": "Hello, kate"
            },
            {
                "question_number": 6,
                "question_type": "MCQ",
                "question_text": "If I have a variable:\n\nvar funkMeister = \"Prince\"\n\nI can print the contents of the funkMeister variable with this statement:\nprint(\\\"\\\(funkMeister)\\\")",
                "question_options": [
                    "True",
                    "False"
                ],
                "question_answer": "False"
            },
            {
                "question_number": 7,
                "question_type": "Short_answer",
                "question_text": "What is the name of the computing term that refers to combining String values (typically using a plus sign)?",
                "question_options": [],
                "question_answer": [
                    "concatenation",
                    "Concatenation",
                    "concatenate",
                    "Concatenate"
                ]
            },
            {
                "question_number": 8,
                "question_type": "Short_answer",
                "question_text": "I want to evaluate if a value on the left side of an equation is less than or equal to a value on the right side of the equation. What do I type between these values to return whether the value is true or false?",
                "question_options": [],
                "question_answer": ["<="]
            }
        ]
    }
]

def get_quizzes():
    return Quizzes