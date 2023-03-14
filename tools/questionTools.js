const { Question } = require("../dbDataModels/question.model");
const { QuestionSet } = require("../dbDataModels/questionSet.model");
const { mongoose } = require("../mongoConnection");

let questionGetter = async (id, questionCode) => {
    return await Question.findOne({ code: questionCode }).then((questionContent) => {
        return { setId: id, question: questionContent, qId: questionContent._id };
    }).catch((err) => {
        return { error: err };
    });
};

let firstQuestionGetter = async () => {
    return await QuestionSet.find().sort({ 'dateString': -1 }).limit(1).then(async (questionSets) => {
        let id = questionSets[0]._id;
        let qCode = "";
        questionSets[0].questions.forEach(async (question) => {
            if (question.order == 1) {
                qCode = question.code;
            }
        });
        return await questionGetter(id, qCode).then((questionObject) => {
            return questionObject;
        });
    });
};

let nextQuestionGetter = async (setId, questionOrder) => {
    return await QuestionSet.findById(setId).then(async (questionSet) => {
        let qCode = "";
        questionSet.questions.forEach(async (question) => {
            if (question.order == questionOrder + 1) {
                qCode = question.code;
            }
        });
        return await questionGetter(setId, qCode).then((questionObject) => {
            return questionObject;
        });
    });
};

let checkAnswer = async (questionId, answerCode) => {
    return await Question.findById(questionId).then((question) => {
        return question.correctAnswer == answerCode;
    }).catch((err) => {
        return { error: err };
    });
};


let firstQuestion = async (session) => {
    return await firstQuestionGetter().then((questionObject) => {
        let jsonResponse = {};
        entities = [];
        let timeString = new Date().getTime();
        if (!questionObject.error) {
            questionObject.question.answers.forEach((answer) => {
                answer.synonyms.push(answer.text);
                entities.push({
                    "value": "0_" + timeString + "_" + questionObject.setId + "_1_" + questionObject.question._id + "_" + answer.id,
                    "synonyms": answer.synonyms
                });
            });



            jsonResponse = {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": ["¡Vamos! " + questionObject.question.text]
                        }
                    }
                ],
                "payload": {
                    "google": {
                        "expectUserResponse": true,
                        "richResponse": {
                            "items": [
                                {
                                    "simpleResponse": {
                                        "textToSpeech": "¡Vamos! " + questionObject.question.text,
                                        "displayText": "¡Vamos! " + questionObject.question.text
                                    }
                                }
                            ]
                        }
                    }

                },

                "sessionEntityTypes": [
                    {
                        "name": session + "/entityTypes/answers",
                        "entities": entities,
                        "entityOverrideMode": "ENTITY_OVERRIDE_MODE_OVERRIDE"
                    }
                ]
            }
        } else {
            jsonResponse = {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": ["Error al obtener la pregunta"]
                        }
                    }
                ]
            }
        }
        return jsonResponse;
    });

};

let nextQuestion = async (score, session, setId, questionOrder, timeString, correct) => {
    if (correct)
        score++;
    return await nextQuestionGetter(setId, parseInt(questionOrder)).then((questionObject) => {
        let jsonResponse = {};
        entities = [];
        let textCorrect = "¡¡Incorrecto!!";
        if (correct)
            textCorrect = "¡¡Correcto!!";

        let newQuestionOrder = (parseInt(questionOrder) + 1).toString();
        if (!questionObject.error) {
            questionObject.question.answers.forEach((answer) => {
                answer.synonyms.push(answer.text);
                entities.push({
                    "value": score.toString() + "_" + timeString + "_" + setId + "_" + newQuestionOrder + "_" + questionObject.question._id + "_" + answer.id,
                    "synonyms": answer.synonyms
                });
            });

            jsonResponse = {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [textCorrect + " " + questionObject.question.text]
                        }
                    }
                ],
                "payload": {
                    "google": {
                        "expectUserResponse": true,
                        "richResponse": {
                            "items": [
                                {
                                    "simpleResponse": {
                                        "textToSpeech": textCorrect + " " + questionObject.question.text,
                                        "displayText": textCorrect + " " + questionObject.question.text
                                    }
                                }
                            ]
                        }
                    }

                },
                "sessionEntityTypes": [
                    {
                        "name": session + "/entityTypes/answers",
                        "entities": entities,
                        "entityOverrideMode": "ENTITY_OVERRIDE_MODE_OVERRIDE"
                    }
                ]
            }
        } else {
            jsonResponse = {
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": ["Error al obtener la pregunta"]
                        }
                    }
                ]
            }
        }
        return jsonResponse;
    });
};

let checkAndNextQuestion = async (score, session, setId, questionOrder, timeString, questionId, answerCode) => {
    return await checkAnswer(questionId, answerCode).then(async (correct) => {
        let newTimeString = new Date().getTime();
        if ((newTimeString - parseInt(timeString)) < 60000 & parseInt(questionOrder) < 10) {
            return await nextQuestion(parseInt(score), session, setId, questionOrder, timeString, correct).then((jsonResponse) => {
                return jsonResponse;
            });
        }
        else {
            jsonResponse = {};
            textCorrect = "¡¡Incorrecto!!";
            if (correct) {
                finalScore = parseInt(score) + 1;
                textCorrect = "¡¡Correcto!!";
            }
            else
                finalScore = parseInt(score);

            if (parseInt(questionOrder) >= 10) {
                jsonResponse = {
                    "followupEventInput": {
                        "name": "partida-completa",
                        "languageCode": "es-ES",
                        "parameters": {
                            "textSalida": textCorrect + " " + "Esta era la última pregunta. Tu puntuación final es de " + finalScore + (finalScore == 1 ? " punto." : " puntos. ¿Volvemos al inicio? (o si quieres, puedes salir del juego)")
                        }
                    }
                }
            }
            else {
                jsonResponse = {
                    "followupEventInput": {
                        "name": "partida-completa",
                        "languageCode": "es-ES",
                        "parameters": {
                            "textSalida": textCorrect + " " + "Pero se te ha acabado el minuto. Tu puntuación final es de " + finalScore + (finalScore == 1 ? " punto." : " puntos. ¿Volvemos al inicio? (o si quieres, puedes salir del juego)")
                        }
                    }
                }
            }

            return jsonResponse;

        }
    });
};

let createQuestionSet = async (questionSet) => {
    let newQuestionSet = new QuestionSet(questionSet);
    return await newQuestionSet.save().then((questionSet) => {
        return { questionSet: questionSet };
    }).catch((err) => {
        return { error: err };
    });
};

let createQuestions = async (questions) => {
    return await Question.collection.insertMany(questions).then((questions) => {
        return questions;
    }).catch((err) => {
        return { error: err };
    });


};


module.exports = { firstQuestion, checkAndNextQuestion, createQuestionSet, createQuestions, nextQuestion };