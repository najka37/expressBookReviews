const express = require('express');
const axios = require('axios');

let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();

// Internal data endpoint used by Axios
public_users.get('/internal/books', (req, res) => {
    res.json(books);
});

// Task 6: Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: 'User successfully registered. Now you can login'
    });
});

// Task 1 and Task 10: Get all books using Axios and async/await
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/customer/internal/books'
        );

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Get all books error:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve books'
        });
    }
});

// Task 2 and Task 11: Get a book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/customer/internal/books'
        );

        const isbn = req.params.isbn;
        const book = response.data[isbn];

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('Get book by ISBN error:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve book'
        });
    }
});

// Task 3 and Task 12: Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/customer/internal/books'
        );

        const author = req.params.author.toLowerCase();

        const result = Object.values(response.data).filter(book =>
            book.author &&
            book.author.toLowerCase() === author
        );

        return res.status(200).json(result);
    } catch (error) {
        console.error('Get books by author error:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve books by author'
        });
    }
});

// Task 4 and Task 13: Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get(
            'http://localhost:5000/customer/internal/books'
        );

        const title = req.params.title.toLowerCase();

        const result = Object.values(response.data).filter(book =>
            book.title &&
            book.title.toLowerCase() === title
        );

        return res.status(200).json(result);
    } catch (error) {
        console.error('Get books by title error:', error.message);

        return res.status(500).json({
            message: 'Unable to retrieve books by title'
        });
    }
});

// Task 5: Get book reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(
            books[isbn].reviews || {}
        );
    }

    return res.status(404).json({
        message: 'Book not found'
    });
});

module.exports.general = public_users;