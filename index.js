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
 
function getContacts(req, res) {
    const contactsList = ['Julia', 'Lucius', 'Aurelia', 'Flavia'];
    res.status(200).json(contactsList);
}
 
function submitForm(req, res) {
    const { content } = req.body;
    res.status(200).json({ content });
}
 
function userProfile(req, res) {
    const profileInfo = {
        firstName: 'Juan',
        lastName: 'Diaz',
        email: 'admin@admin.com',
        birthDate: '1900-02-25'
    };
    res.status(200).json(profileInfo);
}
 
app.post('/login', signIn);
 
app.get('/profile', checkAuthToken, userProfile);
app.get('/contacts', checkAuthToken, getContacts);
app.post('/form', checkAuthToken, submitForm);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor está ejecutándose en el puerto ${PORT}`);
});
