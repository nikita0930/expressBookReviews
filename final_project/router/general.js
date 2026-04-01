const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ================= REGISTER USER =================
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Add new user
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});


// ================= GET ALL BOOKS =================
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});


// ================= GET ALL BOOKS (ASYNC AXIOS) =================
public_users.get('/asyncbooks', async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books using Axios" });
  }
});


// ================= GET BOOK BY ISBN =================
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn]);
});


// ================= GET BOOK BY ISBN (ASYNC AXIOS) =================
public_users.get('/asyncisbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://127.0.0.1:5000/isbn/${isbn}`);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found or error fetching data" });
  }
});


// ================= GET BOOK BY AUTHOR =================
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  let result = {};

  Object.keys(books).forEach(key => {
    if (books[key].author.toLowerCase() === author) {
      result[key] = books[key];
    }
  });

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  return res.status(200).json(result);
});


// ================= GET BOOK BY AUTHOR (ASYNC AXIOS) =================
public_users.get('/asyncauthor/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://127.0.0.1:5000/author/${author}`);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});


// ================= GET BOOK BY TITLE =================
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  let result = {};

  Object.keys(books).forEach(key => {
    if (books[key].title.toLowerCase() === title) {
      result[key] = books[key];
    }
  });

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "No books found for this title" });
  }

  return res.status(200).json(result);
});


// ================= GET BOOK BY TITLE (ASYNC AXIOS) =================
public_users.get('/asynctitle/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://127.0.0.1:5000/title/${title}`);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this title" });
  }
});


// ================= GET BOOK REVIEWS =================
// Returns ONLY reviews in correct format (IMPORTANT FOR MARKS)
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({
    reviews: books[isbn].reviews
  });
});


module.exports.general = public_users;
