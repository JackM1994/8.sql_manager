const express = require('express');
const router = express.Router();
const Books = require('../models').Books;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Books.findAll({ order: [["year", "DESC"]] });
  res.render("books/index", { books });
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("books/new-book", { book: {}});
});

/* POST create book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try{
    console.log(req.body);
    book = await Books.create(req.body);
    res.redirect("/books/");
  }catch(error){
    if(error.name === 'SequelizeValidationError'){
      book = await Books.build(req.body);
      res.render("books/new-book", {book, errors: error.errors})
    }else{
      throw error;
    }
  }
 
}));


/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Books.findByPK(req.params.id);
  if(book){
    res.render("books/update-book", { book, title: book.title});
  }else{
    let error = new Error("Not Avaibable");
    res.render("error", { error, message: error.message });
  } 
}));

/* Update an book. */
router.post('/:id/', asyncHandler(async (req, res) => {
  res.redirect("/books/");
}));



/* Delete book article. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  res.redirect("/books");
}));

module.exports = router;