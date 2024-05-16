const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
 
const app = express();
app.use(express.json());
app.use(cookieParser());
 
function createToken(payload) {
    return jwt.sign(payload, 'key_secreta', { expiresIn: '1h' });
}

function checkAuthToken(req, res, next) {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
 
    jwt.verify(token, 'key_secreta', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.userData = decoded;
        next();
    });
}
 
function signIn(req, res) {
    const { email, password } = req.body;
    if (email === 'admin@admin.com' && password === 'admin') {
        const token = createToken({ email });
        res.cookie('authToken', token, { httpOnly: true });
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
}
