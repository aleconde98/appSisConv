const { OperationSet } = require("../dbDataModels/operationSet.model");
const { mongoose } = require("../mongoConnection");


let firstOperationGetter = async () => {
    return await OperationSet.find().sort({ 'dateString': -1 }).limit(1).then(async (operationSets) => {
        let id = operationSets[0]._id;
        let operationText = "";
        operationText = operationText + operationSets[0].firstNumber + " ";
        operationSets[0].operations.forEach(async (operation) => {
            if (operation.order == 1) {
                switch (operation.operation) {
                    case "s":
                        operationText = operationText + "más ";
                        break;
                    case "r":
                        operationText = operationText + "menos ";
                        break;
                    case "m":
                        operationText = operationText + "por ";
                        break;
                    case "d":
                        operationText = operationText + "entre ";
                        break;
                }
                operationText = operationText + operation.number;

            }
        });
        return { setId: id, operation: operationText, opOrder: 1 };
    });
};

let nextOperationGetter = async (setId, operationOrder) => {
    return await OperationSet.findById(setId).then(async (operationSet) => {
        let operationText = "";
        operationSet.operations.forEach(async (operation) => {
            if (operation.order == operationOrder + 1) {
                switch (operation.operation) {
                    case "s":
                        operationText = operationText + "más ";
                        break;
                    case "r":
                        operationText = operationText + "menos ";
                        break;
                    case "m":
                        operationText = operationText + "por ";
                        break;
                    case "d":
                        operationText = operationText + "entre ";
                        break;
                }
                operationText = operationText + operation.number;
            }

        });
        return { setId: setId, operation: operationText, opOrder: operationOrder + 1 }
    });
};

let checkNumber = async (setId, opOrder, numberAnswer) => {
    return await OperationSet.findById(setId).then((operationSet) => {
        let correctAnswer = undefined;
        operationSet.operations.forEach((operation) => {
            if (operation.order == opOrder) {
                correctAnswer = operation.answer
            }
        });
        if (correctAnswer == numberAnswer) {
            return { correct: true, answer: correctAnswer };
        }
        else {
            return { correct: false, answer: correctAnswer };
        }
    }).catch((err) => {
        return { error: err };
    });
};


let firstOperation = async () => {
    return await firstOperationGetter().then((operationObject) => {
        let jsonResponse = {};
        let timeString = new Date().getTime();
        if (!operationObject.error) {


            jsonResponse = {
                "followupEventInput": {
                    "name": "pregunta-calc",
                    "languageCode": "es-ES",
                    "parameters": {
                        "questioninfo": timeString + "_" + operationObject.setId + "_" + operationObject.opOrder,
                        "questiontext": operationObject.operation
                    }
                },
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

let nextOperation = async (setId, operationOrder, timeString) => {

    return await nextOperationGetter(setId, parseInt(operationOrder)).then((operationObject) => {
        let jsonResponse = {};
        if (!operationObject.error) {


            jsonResponse = {
                "followupEventInput": {
                    "name": "pregunta-calc",
                    "languageCode": "es-ES",
                    "parameters": {
                        "questioninfo": timeString + "_" + operationObject.setId + "_" + operationObject.opOrder,
                        "questiontext": operationObject.operation
                    }
                },
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

let checkAndNextOperation = async (setId, timeString, opOrder, numberAnswer) => {
    return await checkNumber(setId, parseInt(opOrder), parseInt(numberAnswer)).then(async (checkObject) => {
        if (checkObject.correct) {

            if (parseInt(opOrder) < 15) {
                return await nextOperation(setId, parseInt(opOrder), timeString).then((jsonResponse) => {
                    return jsonResponse;
                });
            }
            else {
               let newTimeString = new Date().getTime();
               totalTime = Math.floor(newTimeString - parseInt(timeString))/1000;

               return {
                "followupEventInput": {
                    "name": "partida-completa",
                    "languageCode": "es-ES",
                    "parameters": {
                        "textSalida": "¡Muy bien! Tu tiempo total ha sido de " + totalTime + "segundos. ¿Volvemos al inicio? (o si quieres, puedes salir)",
                    }
                },
            }

            }
        }
        else {
            return {
                "followupEventInput": {
                    "name": "partida-completa",
                    "languageCode": "es-ES",
                    "parameters": {
                        "textSalida": "¡¡Incorrecto!! La respuesta correcta era " + checkObject.answer + ". Hoy no has logrado superar el reto. ¿Volvemos al inicio? (o si quieres, puedes salir)",
                    }
                },
            }







        }
    });
};

let createOperationSet = async (operationSet) => {
    let ok = true;
    let validOperations = ["s", "r", "m", "d"];
    if (operationSet.operations && operationSet.operations.length > 0) {
        operationSet.operations.forEach((operation) => {
            if (!operation.operation || !validOperations.includes(operation.operation) || !operation.number || !operation.answer)
                ok = false;
        });
    }
    else {
        ok = false;
    }

    if (ok) {
        let newOperationSet = new OperationSet(operationSet);
        return await newOperationSet.save().then((operationSet) => {
            return { operationSet: operationSet };
        }).catch((err) => {
            return { error: err };
        });
    }
    else {
        return { error: "Operaciones no válidas" };
    }
};


module.exports = { firstOperation, checkAndNextOperation, createOperationSet, nextOperation };