'use strict';
const express = require('express');
const router = express.Router();


router.get('/test', (req, res) => {
    console.log("Hello World!");
    return res.sendStatus(204);
});

module.exports = router;