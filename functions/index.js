const functions = require('firebase-functions');
const { loadPersonaArray } = require('./loadPersonaArray');
const { savePersonaArray } = require('./savePersonaArray');
const { loadSchema } = require('./loadSchema');
const { saveSchema } = require('./saveSchema');

exports.loadPersonaArray = loadPersonaArray;
exports.savePersonaArray = savePersonaArray;
exports.loadSchema = loadSchema;
exports.saveSchema = saveSchema;
