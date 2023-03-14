const express = require("express");

const config = require('./config.json');


const app = express()

const { firstQuestion, checkAndNextQuestion, createQuestionSet, createQuestions } = require('./tools/questionTools');
const { firstOperation, checkAndNextOperation, createOperationSet } = require('./tools/calculatorTools');

const { WebhookClient } = require('dialogflow-fulfillment');

//Headers para evitar problemas de CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});



app.post('/webhook', express.json(), async function (req, res) {
    const agent = new WebhookClient({ request: req, response: res });
    // console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    // console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

    async function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    async function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    async function primeraPreguntaBat(agent) {
        let session = req.body.session;
        await firstQuestion(session).then((jsonResponse) => {
            agent.client.addJson_(jsonResponse);
        });
    }

    async function preguntaBat(agent) {
        let session = req.body.session;
        let answer = req.body.queryResult.parameters.answers;
        let [score, timeString, setId, questionOrder, questionId, answerCode] = answer.split("_");
        return await checkAndNextQuestion(score, session, setId, questionOrder, timeString, questionId, answerCode).then((jsonResponse) => {
            agent.client.addJson_(jsonResponse);
        });
    }

    async function primeraPreguntaCalc(agent) {
        let session = req.body.session;
        await firstOperation(session).then((jsonResponse) => {
            agent.client.addJson_(jsonResponse);
        });
    }

    async function preguntaCalc(agent) {
        let outCtx = req.body.queryResult.outputContexts;
        let numberAnswer = req.body.queryResult.parameters.number;
        let ctxInfo = outCtx.filter((ctx) => ctx.name.includes("contexts/preguntacalc"));
        let [timeString, setId, opOrder] = ctxInfo[0].parameters.questioninfo.split("_");
        await checkAndNextOperation(setId, timeString, opOrder, numberAnswer).then((jsonResponse) => {
            agent.client.addJson_(jsonResponse);
        });
    }

    async function salidaJuego(agent) {
        let session = req.body.session;
        let answer = req.body.queryResult.parameters.answer;
        if (answer == "FINAL_FINAL") {
            jsonResponse = {
                "sessionEntityTypes": [
                    {
                        "name": session + "/entityTypes/answers",
                        "entities": [
                            {
                                "value": "FINAL_FINAL",
                                "synonyms": []
                            }
                        ],
                        "entityOverrideMode": "ENTITY_OVERRIDE_MODE_OVERRIDE"
                    }
                ],
                "followupEventInput": {
                    "name": "back-inicio",
                    "languageCode": "es-ES",
                    "parameters": {}
                }
            }
            agent.client.addJson_(jsonResponse);
        }
        else if (answer == "SALIR_SALIR") {
            jsonResponse = {
                "sessionEntityTypes": [
                    {
                        "name": session + "/entityTypes/answers",
                        "entities": [
                            {
                                "value": "SALIR_SALIR",
                                "synonyms": []
                            }
                        ],
                        "entityOverrideMode": "ENTITY_OVERRIDE_MODE_OVERRIDE"
                    }
                ],
                "followupEventInput": {
                    "name": "salida-fin",
                    "languageCode": "es-ES",
                    "parameters": {}
                }
            }
        }
        agent.client.addJson_(jsonResponse);
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Primera Pregunta Bateria Intent', primeraPreguntaBat);
    intentMap.set('Pregunta Bateria Intent', preguntaBat);
    intentMap.set('Primera Pregunta Calculadora Intent', primeraPreguntaCalc);
    intentMap.set('Respuesta Calculadora Intent', preguntaCalc);
    intentMap.set('Fin Partida Answer Intent', salidaJuego);
    agent.handleRequest(intentMap);
});

app.post('/createQuestionSet', express.json(), async function (req, res) {
    let questionSet = req.body.questionSet;
    await createQuestionSet(questionSet).then((jsonResponse) => {
        res.send(jsonResponse);
    }).catch((err) => {
        res.send(err);
    });
});

app.post('/createQuestions', express.json(), async function (req, res) {
    let questions = req.body.questions;
    await createQuestions(questions).then((jsonResponse) => {
        res.send(jsonResponse);
    }).catch((err) => {
        res.send(err);
    });
});

app.post('/createOperationSet', express.json(), async function (req, res) {
    let opSet = req.body.operationSet;
    await createOperationSet(opSet).then((jsonResponse) => {
        res.send(jsonResponse);
    }).catch((err) => {
        res.send(err);
    });
});



app.listen(process.env.PORT || config.port, () => {
    console.log("Servidor Escuchando");

})

module.exports = app;

