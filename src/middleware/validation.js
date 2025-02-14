const validateRegistration = (req, res, next) => {
    const { username, email, password } = req.body;

    // Validar username
    if (!username || username.length < 3) {
        return res.status(400).json({
            error: 'El nombre de usuario debe tener al menos 3 caracteres'
        });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            error: 'El correo electrónico no es válido'
        });
    }

    // Validar password
    if (!password || password.length < 6) {
        return res.status(400).json({
            error: 'La contraseña debe tener al menos 6 caracteres'
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'El correo electrónico y la contraseña son requeridos'
        });
    }

    next();
};

const validateProfileUpdate = (req, res, next) => {
    const { username, email, bio } = req.body;

    if (username && username.length < 3) {
        return res.status(400).json({
            error: 'El nombre de usuario debe tener al menos 3 caracteres'
        });
    }

    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'El correo electrónico no es válido'
            });
        }
    }

    if (bio && bio.length > 500) {
        return res.status(400).json({
            error: 'La biografía no puede exceder los 500 caracteres'
        });
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateProfileUpdate
}; 