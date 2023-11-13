const express = require('express');
const router = express.Router();
const User = require('../model/Users');
const Book = require('../model/Book');
const setupDb=require('../model/setupBookLibrary');
const auth=require('../middleware/auth');

/**
 * @description setting up database route
 */

router.get('/setupDb', async (req, res) => {
    try {
        const response= await setupDb(); //calling setupBookLibrary from model and inserting the data
        res.json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Data Insertion Failed')
    }
});

/**
 * @description Get Book details route
 */
router.get('/get-all-books',auth,async(req,res) => {
    try {
        const getAllBooks= await Book.find(); //here we are finding all book data using find() query.
        res.json(getAllBooks); // displaying all data 
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.get('/search-book/:searchedBook',auth, async (req,res) => { //searching books from its parameter 
    try {
        const searchedBook = req.params.searchedBook; //extracting data from params 
        const availabeBooksByName = await Book.find({
            $or:[
                {name: new RegExp(searchedBook, "i")}, // finding book using regular expression  
                {author: new RegExp(searchedBook, "i")} // "i" is used for case sensititive it will make both uppercase and lowercase letter same 
            ]
        
        });
        res.json(availabeBooksByName); //diaplays bookData 
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

router.get('/get-book-by-id/:bookId',auth,async (req,res) => { //searching books by its id 
    try {
        const bookId = req.params.bookId; //extracting data from params
        const book = await Book.findById(bookId); // finding data using findbyid() query passing bookid in finction()
        res.json(book);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

module.exports=router;