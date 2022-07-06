const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res, next) => {
    res.redirect('/books');
})

const booksRouter = require('./routes/books.js');
app.use('/books', booksRouter);

const errorHandler = (err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).json({ message: err.message });
    }
    res.sendStatus(500);
}
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`);
});


