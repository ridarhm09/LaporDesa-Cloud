const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Semua field harus diisi'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password tidak cocok'
            });
        }

        const [existingUser] = await pool.query(
            'SELECT email FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'Email sudah terdaftar'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'user']
        );

        res.status(201).json({
            message: 'Registrasi berhasil'
        });

    } catch (err) {
        console.error('Register error:', err);

        res.status(500).json({
            message: 'Server error'
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Email atau password salah'
            });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Email atau password salah'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET || 'secretkey',
            {
                expiresIn: '1d'
            }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Login error:', err);

        res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = {
    register,
    login
};