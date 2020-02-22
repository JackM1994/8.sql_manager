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
  const books = await Books.findAll({ order: [["title", "ASC"]] });
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
    book = await Books.create(req.body);
    res.redirect("/books/" + book.id);
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
  const book = await Books.findByPk(req.params.id);
  if(book){
    res.render("books/update-book", { book, title: book.title });
  }else{
    res.render('books/page-not-found');
  } 
}));

/* Update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Books.findByPk(req.params.id);
    if(book){
      await book.update(req.body);
      res.redirect("/books/");
    }else{
      res.sendStatus(404);
    } 
  }catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Books.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }   
}));

/* Delete book article. */
router.get('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Books.findByPk(req.params.id);
  if(book){
    res.render("books/delete", {book, title: "Delete Book"});
  } else{
    res.sendStatus(404);
  } 
}));

router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Books.findByPk(req.params.id);
  if(book){
    await book.destroy();
    res.redirect('/books');
  }else{
    let error = new Error("Not Avaibable");
    res.render("error", { error, message: error.message });
  }
 
}));

module.exports = router;