import { randomUUID } from "crypto";

interface Course {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl: string;
    lessons?: Lesson[];
}

interface Lesson {
    id: string;
    title: string;
    description: string;
    materials?: Material[];
}

interface Material {
    id: string;
    type: 'video' | 'quiz';
    title: string;
    url?: string;
    duration?: number;
    quiz?: Quiz;
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

interface Question {
    id: string;
    text: string;
    type: 'single' | 'multiple';
    options: AnswerOption[];
}

interface AnswerOption {
    id: string;
    option: string;
    isCorrect: boolean;
}

export const courses: Course[] = [
    // C Programming Course
    {
        "id": randomUUID(),
        "title": "GO Programming Course",
        "description": "Learn the basics of GO programming through video lessons, hands-on exercises, and quizzes. Perfect for beginners aiming to build a strong foundation in a powerful, low-level language.",
        "imageUrl": "https://placehold.co/600x400?text=GO+Programming+Course",
        "videoUrl": "https://www.youtube.com/watch?v=446E-r0rXHI",
        "lessons": [
            // LESSON 1
            {
                "id": randomUUID(),
                "title": "Introduction to GO",
                "description": "Learn the basics of GO programming.",
                "materials": [
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Welcome to series on GO programming language",
                        "url": "https://www.youtube.com/watch?v=JoJ8Sw5Yb4c",
                        "duration": 5
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Before you start with golang",
                        "url": "https://www.youtube.com/watch?v=F3klnY_r8FU",
                        "duration": 8
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Golang installation and hello world",
                        "url": "https://www.youtube.com/watch?v=62qGe9yhiJI",
                        "duration": 12
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "GOPATH and reading go docs",
                        "url": "https://www.youtube.com/watch?v=QEZlivtFOZk",
                        "duration": 7
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Lexer in golang and Types",
                        "url": "https://www.youtube.com/watch?v=elYPAeX9h1E",
                        "duration": 7
                    },
                ],
            },
            // LESSON 2
            {
                "id": randomUUID(),
                "title": "Data types and data structures",
                "description": "Learn about data types and data structures in GO.",
                "materials": [
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://www.youtube.com/watch?v=9fYqg6uo-UU",
                        "title": "Variables, types and constants",
                        "duration": 17
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://www.youtube.com/watch?v=zYIZtbyUIDY",
                        "title": "Comma ok syntax and packages in golang",
                        "duration": 12
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://www.youtube.com/watch?v=3j43y-PFJPI",
                        "title": "Conversions in golang",
                        "duration": 11
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://www.youtube.com/watch?v=JoUSa8jtadE",
                        "title": "Array in golang",
                        "duration": 7
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://www.youtube.com/watch?v=k7hVj8QL9Co",
                        "title": "Slices in golang",
                        "duration": 15
                    },
                    {
                        "id": randomUUID(),
                        "type": "quiz",
                        "title": "Operator in GO",
                        "duration": 10,
                        "quiz": {
                            "id": randomUUID(),
                            "title": "Operators in GO Quiz",
                            "description": "This quiz tests your knowledge of operators in GO.",
                            "questions": [
                                {
                                    "id": randomUUID(),
                                    "text": "What is the output of 10 % 3?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "1", "isCorrect": true },
                                        { id: randomUUID(), "option": "3", "isCorrect": false },
                                        { id: randomUUID(), "option": "10", "isCorrect": false },
                                        { id: randomUUID(), "option": "0", "isCorrect": false },
                                    ],
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "What is the result of 5 + 3 * 2?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "16", "isCorrect": false },
                                        { id: randomUUID(), "option": "11", "isCorrect": true },
                                        { id: randomUUID(), "option": "10", "isCorrect": false },
                                        { id: randomUUID(), "option": "1", "isCorrect": false },
                                    ],
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which operator is used for bitwise AND?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "&", "isCorrect": true },
                                        { id: randomUUID(), "option": "|", "isCorrect": false },
                                        { id: randomUUID(), "option": "^", "isCorrect": false },
                                        { id: randomUUID(), "option": "~", "isCorrect": false },
                                    ],
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which ones of the following are logical operators?",
                                    "type": "multiple",
                                    "options": [
                                        { id: randomUUID(), "option": "&&", "isCorrect": true },
                                        { id: randomUUID(), "option": "||", "isCorrect": true },
                                        { id: randomUUID(), "option": "!", "isCorrect": true },
                                        { id: randomUUID(), "option": "&", "isCorrect": false },
                                        { id: randomUUID(), "option": "|", "isCorrect": false },
                                        { id: randomUUID(), "option": "^", "isCorrect": false },
                                    ],
                                }
                            ]
                        }
                    },
                    {
                        "id": randomUUID(),
                        "type": "quiz",
                        "title": "Data types and data structures in GO",
                        "duration": 10,
                        "quiz": {
                            "id": randomUUID(),
                            "title": "Data types and data structures in GO Quiz",
                            "description": "This quiz tests your knowledge of data types and data structures in GO.",
                            "questions": [
                                {
                                    "id": randomUUID(),
                                    "text": "What is the default value of an uninitialized int variable in GO?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "0", "isCorrect": true },
                                        { id: randomUUID(), "option": "1", "isCorrect": false },
                                        { id: randomUUID(), "option": "-1", "isCorrect": false },
                                        { id: randomUUID(), "option": "undefined", "isCorrect": false },
                                    ],
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which of the following is a valid slice declaration in GO?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "var s []int", "isCorrect": true },
                                        { id: randomUUID(), "option": "var s [5]int", "isCorrect": false },
                                        { id: randomUUID(), "option": "var s int[]", "isCorrect": false },
                                        { id: randomUUID(), "option": "var s []int[]", "isCorrect": false },
                                    ],
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "What is the length of an empty slice in GO?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "0", "isCorrect": true },
                                        { id: randomUUID(), "option": "1", "isCorrect": false },
                                        { id: randomUUID(), "option": "undefined", "isCorrect": false },
                                        { id: randomUUID(), "option": "nil", "isCorrect": false },
                                    ],
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which of the following is a valid way to create a map in GO?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "var m map[string]int", "isCorrect": true },
                                        { id: randomUUID(), "option": "var m map[int]string", "isCorrect": false },
                                        { id: randomUUID(), "option": "var m map[string]", "isCorrect": false },
                                        { id: randomUUID(), "option": "var m map[int]", "isCorrect": false },
                                    ],
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which ones of the following are valid map initializations in GO?",
                                    "type": "multiple",
                                    "options": [
                                        { id: randomUUID(), "option": "m := make(map[string]int)", "isCorrect": true },
                                        { id: randomUUID(), "option": "m := map[string]int{}", "isCorrect": true },
                                        { id: randomUUID(), "option": "m := map[int]string{}", "isCorrect": false },
                                        { id: randomUUID(), "option": "m := make(map[int]string)", "isCorrect": false },
                                    ],
                                },
                            ]
                        }
                    }
                ]
            },
            // LESSON 3
            {
                "id": randomUUID(),
                "title": "Flow Control and Functions",
                "description": "Learn about flow control and functions in GO.",
                "materials": [
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://youtu.be/f_xNeRurjZY",
                        "title": "If else in golang",
                        "duration": 9
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://youtu.be/Up4lTPhJBvs",
                        "title": "Switch case in golang and online playground",
                        "duration": 10
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://youtu.be/ZWBA3l818y0",
                        "title": "Loop break continue and goto in golang",
                        "duration": 12
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://youtu.be/rcUST3QvVOQ",
                        "title": "Functions in golang",
                        "duration": 14
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://youtu.be/GhYIKwMxz_Y",
                        "title": "Methods in golang",
                        "duration": 9
                    },
                ],
            },
            // LESSON 4 
            {
                "id": randomUUID(),
                "title": "Web, JSON and APIs",
                "description": "Learn about web, JSON and APIs in GO.",
                "materials": [
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://youtu.be/Mdg3tlGUXrE",
                        "title": "Working with files in golang",
                        "duration": 13
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://youtu.be/ru53LpdVHn4",
                        "title": "Handling web request in golang",
                        "duration": 12
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://youtu.be/h5NeKZuzUoc",
                        "title": "How to make POST request with JSON data in golang",
                        "duration": 8
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://youtu.be/SZ5xZ9OTeEI",
                        "title": "How to create JSON data in golang",
                        "duration": 16
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "url": "https://youtu.be/a96veXdifys",
                        "title": "How to consume JSON data in golang",
                        "duration": 14
                    },
                    {
                        "id": randomUUID(),
                        "type": "quiz",
                        "title": "How to consume JSON data in golang",
                        "duration": 10,
                        "quiz": {
                            "id": randomUUID(),
                            "title": "How to consume JSON data in golang Quiz",
                            "description": "This quiz tests your knowledge of how to consume JSON data in golang.",
                            "questions": [
                                {
                                    "id": randomUUID(),
                                    "text": "What is JSON?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "JavaScript Object Notation", "isCorrect": true },
                                        { id: randomUUID(), "option": "JavaScript Object Notation Language", "isCorrect": false },
                                        { id: randomUUID(), "option": "JavaScript Object Notation Format", "isCorrect": false },
                                        { id: randomUUID(), "option": "JavaScript Object Notation Data", "isCorrect": false },
                                    ],
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which of the following is a valid JSON object?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": '{"name": "John", "age": 30}', "isCorrect": true },
                                        { id: randomUUID(), "option": '{"name": "John", age: 30}', "isCorrect": false },
                                        { id: randomUUID(), "option": '{"name": "John", "age": "30"}', "isCorrect": false },
                                        { id: randomUUID(), "option": '{"name": "John", "age": 30,}', "isCorrect": false },
                                    ],
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which of the following are valid JSON data types?",
                                    "type": "multiple",
                                    "options": [
                                        { id: randomUUID(), "option": "String", "isCorrect": true },
                                        { id: randomUUID(), "option": "Number", "isCorrect": true },
                                        { id: randomUUID(), "option": "Boolean", "isCorrect": true },
                                        { id: randomUUID(), "option": "Array", "isCorrect": true },
                                        { id: randomUUID(), "option": "Object", "isCorrect": true },
                                        { id: randomUUID(), "option": "Function", "isCorrect": false },
                                        { id: randomUUID(), "option": "Date", "isCorrect": false },
                                        { id: randomUUID(), "option": "Undefined", "isCorrect": false },
                                        { id: randomUUID(), "option": "Null", "isCorrect": true },
                                    ],
                                },
                            ]
                        }
                    },
                ]
            },
            // LESSON 5 
            {
                "id": randomUUID(),
                "title": "Go Concurrency",
                "description": "Understand goroutines, channels, mutex, and the select statement in Go.",
                "materials": []
            }
        ],
    },
    // Python Programming Course
    {
        "id": randomUUID(),
        "title": "Python Programming Course",
        "description": "Start coding with Python using engaging videos, practical examples, and interactive quizzes. Designed for beginners who want to master one of today’s most versatile programming languages.",
        "imageUrl": "https://placehold.co/600x400?text=Python+Programming+Course",
        "videoUrl": "https://www.youtube.com/watch?v=x7X9w_GIm1s",
        "lessons": [
            // LESSON 1
            {
                "id": randomUUID(),
                "title": "Introduction to Python",
                "description": "Learn the basics of Python programming.",
                "materials": [
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Python Language",
                        "url": "https://www.youtube.com/watch?v=Z4AOP7-b1RM&list=PLWtYZ2ejMVJnh0KVllw24XklzJ62WNFsj&index=1&pp=iAQB0gcJCX4JAYcqIYzv",
                        "duration": 6,
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Download and Install Python & PyCharm",
                        "url": "https://www.youtube.com/watch?v=btrTN0q5SFY&list=PLWtYZ2ejMVJnh0KVllw24XklzJ62WNFsj&index=2&pp=iAQB",
                        "duration": 6
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Hello World",
                        "url": "https://www.youtube.com/watch?v=03KPwEs5Gj4&list=PLWtYZ2ejMVJnh0KVllw24XklzJ62WNFsj&index=3&pp=iAQB",
                        "duration": 5
                    },
                ],
            },
            // LESSON 2
            {
                "id": randomUUID(),
                "title": "Variables and Operators",
                "description": "Understand variables and operators in Python.",
                "materials": [
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Variables and Values assignation",
                        "url": "https://www.youtube.com/watch?v=8yt2mpOnftg&list=PLWtYZ2ejMVJnh0KVllw24XklzJ62WNFsj&index=4&pp=iAQB",
                        "duration": 10
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Arithmetic Operators",
                        "url": "https://www.youtube.com/watch?v=PMOWXusLr9g&list=PLWtYZ2ejMVJnh0KVllw24XklzJ62WNFsj&index=6&pp=iAQB",
                        "duration": 7
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Relational Operators",
                        "url": "https://www.youtube.com/watch?v=mIAPti7iUKk&list=PLWtYZ2ejMVJnh0KVllw24XklzJ62WNFsj&index=7&pp=iAQB0gcJCX4JAYcqIYzv",
                        "duration": 6
                    },
                    {
                        "id": randomUUID(),
                        "type": "video",
                        "title": "Logical Operators",
                        "url": "https://www.youtube.com/watch?v=ZjeOT_ACdhw&list=PLWtYZ2ejMVJnh0KVllw24XklzJ62WNFsj&index=8&pp=iAQB",
                        "duration": 9
                    },
                    {
                        "id": randomUUID(),
                        "type": "quiz",
                        "title": "Variables and Operators",
                        "duration": 5,
                        "quiz": {
                            "id": randomUUID(),
                            "title": "Variables and Operators Quiz",
                            "description": "This quiz tests your knowledge of variables and operators in Python.",
                            "questions": [
                                {
                                    "id": randomUUID(),
                                    "text": "What is the output of print(5 + 3 * 2)?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "11", "isCorrect": true },
                                        { id: randomUUID(), "option": "16", "isCorrect": false },
                                        { id: randomUUID(), "option": "10", "isCorrect": false },
                                        { id: randomUUID(), "option": "1", "isCorrect": false },
                                    ],

                                },
                                {
                                    "id": randomUUID(),
                                    "text": "What is the result of 10 % 3?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "1", "isCorrect": true },
                                        { id: randomUUID(), "option": "3", "isCorrect": false },
                                        { id: randomUUID(), "option": "10", "isCorrect": false },
                                        { id: randomUUID(), "option": "0", "isCorrect": false },
                                    ],
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which operator is used for bitwise AND?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "&", "isCorrect": true },
                                        { id: randomUUID(), "option": "|", "isCorrect": false },
                                        { id: randomUUID(), "option": "^", "isCorrect": false },
                                        { id: randomUUID(), "option": "~", "isCorrect": false },
                                    ],
                                },
                            ],
                        }
                    },
                    {
                        "id": randomUUID(),
                        "type": "quiz",
                        "title": "Operators in Python (Advanced)",
                        "duration": 5,
                        "quiz": {
                            "id": randomUUID(),
                            "title": "Operators in Python Quiz",
                            "description": "This quiz tests your knowledge of operators in Python.",
                            "questions": [
                                {
                                    "id": randomUUID(),
                                    "text": "Select the correct operators for the following operations:",
                                    "type": "multiple",
                                    "options": [
                                        { id: randomUUID(), "option": "+", "isCorrect": true },
                                        { id: randomUUID(), "option": "-", "isCorrect": true },
                                        { id: randomUUID(), "option": "*", "isCorrect": true },
                                        { id: randomUUID(), "option": "/", "isCorrect": true },
                                        { id: randomUUID(), "option": "%", "isCorrect": false },
                                    ]
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which operator is used for exponentiation?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "**", "isCorrect": true },
                                        { id: randomUUID(), "option": "^", "isCorrect": false },
                                        { id: randomUUID(), "option": "^^", "isCorrect": false },
                                    ]
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which operator is used for floor division?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "//", "isCorrect": true },
                                        { id: randomUUID(), "option": "/", "isCorrect": false },
                                        { id: randomUUID(), "option": "%", "isCorrect": false },
                                        { id: randomUUID(), "option": "%%", "isCorrect": false },
                                    ]
                                },
                                {
                                    "id": randomUUID(),
                                    "text": "Which operator is used for identity?",
                                    "type": "single",
                                    "options": [
                                        { id: randomUUID(), "option": "is", "isCorrect": true },
                                        { id: randomUUID(), "option": "==", "isCorrect": false },
                                        { id: randomUUID(), "option": "is not", "isCorrect": false },
                                        { id: randomUUID(), "option": "!=", "isCorrect": false },
                                    ]
                                }
                            ],
                        }
                    }
                ]
            },
        ],
    },
    // Java Programming Course
    {
        "id": randomUUID(),
        "title": "Java Programming Course",
        "description": "Master Java from the ground up with comprehensive video lessons, coding exercises, and quizzes. Ideal for beginners looking to learn object-oriented programming with real-world applications.",
        "imageUrl": "https://placehold.co/600x400?text=Java+Programming+Course",
        "videoUrl": "https://www.youtube.com/watch?v=l9AzO1FMgM8",
        "lessons": [
            // LESSON 1
            {
                "id": randomUUID(),
                "title": "Introduction to Java",
                "description": "Learn the basics of Java programming.",
            },
            // LESSON 2
            {
                "id": randomUUID(),
                "title": "Java Basics",
                "description": "Understand the basic syntax and structure of Java.",
            },
            // LESSON 3
            {
                "id": randomUUID(),
                "title": "Java Data Types",
                "description": "Learn about different data types in Java.",
            },
        ],
    },
    // C Programming Course
    {
        "id": randomUUID(),
        "title": "C Programming Course",
        "description": "Explore C through step-by-step video tutorials, exercises, and quizzes. A beginner-friendly course to learn a modern, efficient, and scalable language used in today’s backend systems.",
        "imageUrl": "https://placehold.co/600x400?text=GO+Programming+Course",
        "videoUrl": "https://www.youtube.com/watch?v=U3aXWizDbQ4",
        "lessons": []
    }
]