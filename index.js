// const express = require("express");


// const app = express()


// //Headers para evitar problemas de CORS
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
//     res.header(
//         'Access-Control-Expose-Headers',
//         'x-access-token, x-refresh-token'
//     );

//     next();
// });

// app.get('/calc', function (req, res) {
//     return res.json(
//         {
//             "primerNumero": 10,
//             "preguntas": [
//                 { "id": 0, "numero": 7, "operacion": "a", "respuesta": 17 },
//                 { "id": 1, "numero": 2, "operacion": "m", "respuesta": 34 },
//                 { "id": 2, "numero": 1, "operacion": "s", "respuesta": 33 },
//                 { "id": 3, "numero": 3, "operacion": "d", "respuesta": 11 },
//                 { "id": 4, "numero": 4, "operacion": "a", "respuesta": 15 },
//                 { "id": 5, "numero": 12, "operacion": "m", "respuesta": 180 },
//                 { "id": 6, "numero": 5, "operacion": "s", "respuesta": 175 },
//                 { "id": 7, "numero": 7, "operacion": "d", "respuesta": 25 },
//                 { "id": 8, "numero": 62, "operacion": "a", "respuesta": 87 },
//                 { "id": 9, "numero": 3, "operacion": "d", "respuesta": 29 },
//                 { "id": 10, "numero": 2, "operacion": "m", "respuesta": 58 },
//                 { "id": 11, "numero": 16, "operacion": "m", "respuesta": 74 },
//                 { "id": 12, "numero": 5, "operacion": "m", "respuesta": 370 },
//                 { "id": 13, "numero": 2, "operacion": "s", "respuesta": 368 },
//                 { "id": 14, "numero": 8, "operacion": "d", "respuesta": 46 }
//             ]

//         }
//     );
// });

// app.get('/bat', function (req, res) {
//     return res.json(
//         {
//             "preguntas":
//                 [{
//                     "pregunta": "Pregunta A", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": true },
//                         { "respuesta": "Respuesta B", "correcta": false },
//                         { "respuesta": "Respuesta C", "correcta": false },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta B", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": false },
//                         { "respuesta": "Respuesta B", "correcta": true },
//                         { "respuesta": "Respuesta C", "correcta": false },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta C", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": false },
//                         { "respuesta": "Respuesta B", "correcta": false },
//                         { "respuesta": "Respuesta C", "correcta": true },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta D", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": true },
//                         { "respuesta": "Respuesta B", "correcta": false },
//                         { "respuesta": "Respuesta C", "correcta": false },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta E", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": false },
//                         { "respuesta": "Respuesta B", "correcta": true },
//                         { "respuesta": "Respuesta C", "correcta": false },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta F", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": false },
//                         { "respuesta": "Respuesta B", "correcta": false },
//                         { "respuesta": "Respuesta C", "correcta": true },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta G", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": true },
//                         { "respuesta": "Respuesta B", "correcta": false },
//                         { "respuesta": "Respuesta C", "correcta": false },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta H", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": false },
//                         { "respuesta": "Respuesta B", "correcta": true },
//                         { "respuesta": "Respuesta C", "correcta": false },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta I", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": false },
//                         { "respuesta": "Respuesta B", "correcta": false },
//                         { "respuesta": "Respuesta C", "correcta": true },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta J", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": true },
//                         { "respuesta": "Respuesta B", "correcta": false },
//                         { "respuesta": "Respuesta C", "correcta": false },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta K", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": false },
//                         { "respuesta": "Respuesta B", "correcta": true },
//                         { "respuesta": "Respuesta C", "correcta": false },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta L", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": false },
//                         { "respuesta": "Respuesta B", "correcta": false },
//                         { "respuesta": "Respuesta C", "correcta": true },
//                     ]
//                 },
//                 {
//                     "pregunta": "Pregunta M", "respuestas": [
//                         { "respuesta": "Respuesta A", "correcta": true },
//                         { "respuesta": "Respuesta B", "correcta": false },
//                         { "respuesta": "Respuesta C", "correcta": false },
//                     ]
//                 }
//                 ]
//         }
//     )
// });

// app.listen(process.env.PORT || 8080, () => {
//     console.log("Servidor Escuchando");

// })

// module.exports = app;

// index.js
const express = require('express')

const app = express()
const PORT = 4000

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})

// Export the Express API
module.exports = app
