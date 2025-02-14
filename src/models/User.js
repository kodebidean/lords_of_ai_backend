const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class User {
    static async create({ username, email, password, profile_image_url = null, bio = null }) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = `
                INSERT INTO users (username, email, password_hash, profile_image_url, bio)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING user_id, username, email, created_at, profile_image_url, bio
            `;
            const values = [username, email, hashedPassword, profile_image_url, bio];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    static async findByEmail(email) {
        try {
            const query = `
                SELECT user_id, username, email, password_hash, created_at, profile_image_url, bio 
                FROM users WHERE email = $1
            `;
            const result = await pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            console.error('Error completo en findByEmail:', error);
            throw new Error(`Error finding user: ${error.message}`);
        }
    }

    static async findById(userId) {
        try {
            const query = `
                SELECT user_id, username, email, created_at, profile_image_url, bio 
                FROM users WHERE user_id = $1
            `;
            const result = await pool.query(query, [userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error finding user: ${error.message}`);
        }
    }

    static async update(userId, { username, email, bio, profile_image_url }) {
        try {
            const query = `
                UPDATE users 
                SET username = COALESCE($1, username),
                    email = COALESCE($2, email),
                    bio = COALESCE($3, bio),
                    profile_image_url = COALESCE($4, profile_image_url)
                WHERE user_id = $5
                RETURNING user_id, username, email, created_at, profile_image_url, bio
            `;
            const values = [username, email, bio, profile_image_url, userId];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    static async validatePassword(providedPassword, storedHash) {
        return bcrypt.compare(providedPassword, storedHash);
    }
}

module.exports = User; 