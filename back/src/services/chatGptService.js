const OpenAI = require("openai");
const Task = require("../models/Task");

const createTasksFromResponse = async (jsonResponse, userId, originalMessage) => {
    try {
        // Create parent project task
        const parentTask = await Task.create({
            title: jsonResponse.project,
            description: originalMessage,
            userId: userId
        });

        // Create child tasks
        const childTaskPromises = jsonResponse.tasks.map(task => {
            return Task.create({
                title: task.title,
                description: task.description,
                parentTaskId: parentTask.id,
                userId: userId
            });
        });

        await Promise.all(childTaskPromises);
        return true;
    } catch (error) {
        console.error('Error creating tasks:', error);
        throw error;
    }
};

const completion = async (message, userId) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "developer",
                content: `Tu es un assistant qui aide à découper les projets en features et en tâches.
                Retourne uniquement un JSON bien formé et valide. Retourne au maximum 4 tâches.
                Voici le format attendu :
                {
                    "project": "Nom du projet",
                    "tasks": [
                        {
                            "title": "Nom de la task",
                            "description": "Description de la task"
                        },
                        {
                            "title": "Nom de la task",
                            "description": "Description de la task"
                        },
                        {
                            "title": "Nom de la task",
                            "description": "Description de la task"
                        }
                    ]
                }`
            },
            { role: "user", content: message }
        ],
        response_format: { type: "json_object" }
    });

    const jsonResponse = JSON.parse(response.choices[0].message.content);
    
    // Create tasks in database
    await createTasksFromResponse(jsonResponse, userId, message);

    return jsonResponse;
};

module.exports = completion;
