const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
 
const app = express();
app.use(express.json());
app.use(cookieParser());
 
function createToken(payload) {
    return jwt.sign(payload, 'key_secreta', { expiresIn: '1h' });
}
