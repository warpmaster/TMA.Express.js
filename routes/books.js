const router = require('express').Router();

let booksList = [
    {
        id: 1,
        title: "Harry Potter and the Philosopher's Stone",
        reviews: [
            {
                id: 1,
                comment: "Nice"
            },
            {
                id: 2,
                comment: "Awesome!"
            },
            {
                id: 3,
                comment: "I'm not impressed..."
            }
        ]
    },
    {
        id: 2,
        title: "Harry Potter and the Chamber of Secrets",
        reviews: [
            {
                id: 1,
                comment: "I like it!"
            }
        ]
    },
    {
        id: 3,
        title: "Harry Potter and the Prisoner of Azkaban",
        reviews: [
            {
                id: 1,
                comment: "Impressive"
            }
        ]
    },
];

const validateBook = (req, res, next) => {
    const book = booksList.find(book => book.id === Number(req.params.bookId));
    if (!book) {
        return next({ status: 404, message: "Book not found."});
    }
    req.book = book;
    next();
}

const validateReview = (req, res, next) => {
    const review = req.book.reviews.find(review => review.id === Number(req.params.reviewId));
    if (!review) {
        return next({ status: 404, message: "Review not found."});
    }
    req.review = review;
    next();
}

router.get('/', (req, res, next) => {
    try {
        res.json(booksList);
    } catch (err) {
        next(err);
    }
})

router.post('/', (req, res, next) => {
    try {
        const newBook = { ...req.body };
        newBook.id = Math.max(...booksList.map(book => book.id)) + 1;

        booksList.push(newBook);

        res.json(newBook);
    } catch (err) {
        next(err);
    }
});

router.get('/:bookId',
    validateBook,
    (req, res, next) => {
    try {
        res.json(req.book);
    } catch (err) {
        next(err);
    }
})

router.patch('/:bookId',
    validateBook,
    (req, res, next) => {
        try {
            const book = booksList.find(book => book.id === req.book.id );

            req.book.title = req.body.title;

            res.json(req.book);
        } catch (err) {
            next(err);
        }
    })

router.delete('/:bookId',
    validateBook,
    (req, res, next) => {
        try {
            booksList = booksList.filter( book => book.id !== req.book.id );

            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    })

router.get('/:bookId/reviews',
    validateBook,
    (req, res, next) => {
        try {
            res.json(req.book.reviews);
        } catch (err) {
            next(err);
        }
    })

router.post('/:bookId/reviews',
    validateBook,
    (req, res, next) => {
        try {
            const newReview = { ...req.body };
            newReview.id = Math.max(...req.book.reviews.map(review => review.id)) + 1;

            req.book.reviews.push(newReview);

            res.json(newReview);
        } catch (err) {
            next(err);
        }
    });

router.get('/:bookId/reviews/:reviewId',
    validateBook,
    validateReview,
    (req, res, next) => {
        try {
            res.json(req.review);
        } catch (err) {
            next(err);
        }
    })

router.delete('/:bookId/reviews/:reviewId',
    validateBook,
    validateReview,
    (req, res, next) => {
        try {
            req.book.reviews = req.book.reviews.filter( review => review.id !== req.review.id );

            res.sendStatus(200);
        } catch (err) {
            next(err);
        }
    })

module.exports = router;