const express = require('express');
const router = express.Router();
const { executeCode, getSupportedLanguages } = require('../controllers/codeController');

// POST /api/code/execute - Execute code
router.post('/execute', executeCode);

// GET /api/code/languages - Get supported languages
router.get('/languages', getSupportedLanguages);

module.exports = router;