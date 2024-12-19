const functions = require('firebase-functions');
const { callOpenAI } = require('./callOpenAI'); // This is a new function file

exports.callOpenAI = callOpenAI;
