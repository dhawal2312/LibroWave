const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../model/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config=require('config');
const jwtSecretToken = process.env.jwtSecretToken;
const auth=require('../middleware/auth');
const Book = require('../model/Book');



/**
 * @description Register user route
 */
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),  //here we are checking its validation using express validator
    check('email', 'Please incude a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req); //storing error if there is any error

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const { name, email, password } = req.body; // extracting name,email and password from body

    try {
        let user = await User.findOne({ email }); //finding user whether that user is present or not 
        if (user) {
            return res.status(400).json({
                errors: [{ msg: 'User already exists' }] // if user is already registerd then we will not allow to register 
            })
        }
        // storing user information in new object 
        user = new User({
            name,
            email,
            password
        });

        //Encrypt password

        const salt = await bcrypt.genSalt(10); // generating  hashed form 
        user.password = await bcrypt.hash(password, salt);  //making password in hashed form

        await user.save(); //storig user information in database

        // Return jwt

        const payload = {
            user: {
                id: user.id //storing user id in payload 
            }
        }
        // giving token to user
        jwt.sign(
            payload,
            jwtSecretToken,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );



    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @description Get issuedBooks details route
 */

router.get('/get-issued-books',auth,async(req,res) => {
    try {
        const issued = await User.findById(req.user.id).select('issuedBooks'); //finding user by its id and in which only issuedBooks will be selected 
        res.json(issued.issuedBooks); //displaying issuedBooks only
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

/**
 * @description Get returned books details route
 */

router.get('/get-returned-books',auth,async(req,res) => {
    try {
        //finding user by its id and in which only returnedBooks will be selected 
        const getReturnedBooks = await User.findById(req.user.id).select('returnedBooks');
        res.json(getReturnedBooks.returnedBooks); //displaying returned books only in array form
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

// here we are issuing book by its book id
router.post('/issue-book/:bookId',auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); //finding user by its id by removing password
        //console.log(user);
        if (!user) { //if there is no user then user will not be found 
            return res.status(404).json({
                errors: [{ msg: 'User Not Found' }]
            })
        }
        const book = await Book.findById(req.params.bookId); //finding books by extracting book data from params
        //console.log(book);
        if (!book) { 
            return res.status(404).json({
                errors: [{ msg: 'Book Not Found' }]
            })
        }
        // if there is no book available for issue then we will displays book not available for issue 
        if(book.quantity<1){
            return res.status(404).json({
                errors: [{ msg: 'Book Not Available for Issue' }]
            })
        }
        //here we are iterating issued books and searching by its id and converting each id to string and then comparing 
        const isBookIssued = user.issuedBooks.some((book) => book.book.toString() === req.params.bookId );

        // console.log(isBookIssued);

        // const isBookIssued = user.issuedBooks.some((book) => {
        //     console.log("Book",book);
        //     console.log("Issue book id",req.params.bookId)
        //     return book.book.toString() === req.params.bookId
        // } );

        if(isBookIssued){ // if book is issued then we will diaplay book is already issued 
            return res.status(400).json({
                errors: [{ msg: 'Book is already issued' }]
            })
        }
        const issuedBook = {
            book:req.params.bookId // if book is not issued then we will store its bookid in book.
        }
        user.issuedBooks.unshift(issuedBook); // we will push issued books in issuedbooks array this will work as queue

        user.notificationFlags.unshift(issuedBook);

        await user.save(); // saving updated database 

        book.quantity-=1; // decreasing book quantity by 1 

        await book.save(); // saving book database
        
        return res.status(201).json({ msg: 'Book issued successfully' }); // returning msg as Book issued successfully

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

router.post('/return-book/:bookId',auth,async(req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');//finding user by its id by removing password
        //console.log(user);
        if (!user) { //if there is no user then user will not be found 
            return res.status(404).json({
                errors: [{ msg: 'User Not Found' }]
            })
        }
        const book = await Book.findById(req.params.bookId); //finding books by extracting book data from params
        //console.log(book);
        if (!book) {
            return res.status(404).json({
                errors: [{ msg: 'Book Not Found' }]
            })
        }
        const issued = await User.findById(req.user.id).select('issuedBooks'); //finding issued books by its id and selecting issued books
        const allIssuedBooks = issued.issuedBooks; // storing issuedbooks in new array
        console.log(allIssuedBooks);
        // iterating allissuedbooks array and comparing bookid with stored book id in issuedbooks array
        const isBookIssued = allIssuedBooks.some((book) => book.book.toString() === req.params.bookId );
        if(!isBookIssued){ // if there is no book issued with that book id then we will send msg as book not issued
            return res.status(404).json({
                errors: [{ msg: 'Book is not issued' }]
            })
        }
        // confirmed book is issued
        const issuedBook = {
            book:req.params.bookId // storing book id in book which is to be returned
        }
        //pushing its elements in returned books, works as queue
        user.returnedBooks.unshift(issuedBook);
        // filtering all issued books except that book id which is to be returned and storing in new array
        const newArray = user.issuedBooks.filter(obj => obj.book.toString() !== req.params.bookId);

        user.issuedBooks = newArray; //storing new array in issued books 

        const updatedNotificationFlags = user.notificationFlags.filter(obj => obj.book.toString() !== req.params.bookId);

        user.notificationFlags=updatedNotificationFlags;

        await user.save(); // saving user database

        book.quantity+=1; // increasing book quantity by 1

        await book.save(); //saving book database
        
        return res.status(201).json({ msg: 'Book returned successfully' }); // sending msg as book returned successfully.
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

router.post('/reIssue-book/:bookId',auth,async(req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); //finding user by its id by removing password
        //console.log(user);
        if (!user) { //if there is no user then user will not be found 
            return res.status(404).json({
                errors: [{ msg: 'User Not Found' }]
            })
        }
        const book = await Book.findById(req.params.bookId); //finding books by extracting book data from params
        //console.log(book);
        if (!book) {
            return res.status(404).json({
                errors: [{ msg: 'Book Not Found' }]
            })
        }
        //const issued = await User.findById(req.user.id).select('issuedBooks');

        const allIssuedBooks = user.issuedBooks; //storing issued books in allissuedbooks
        //finding whether that book is issued or not 
        const isBookIssued = allIssuedBooks.some((book) => book.book.toString() === req.params.bookId );
        //if book is not issued then we will displays book is not issued
        if(!isBookIssued){
            return res.status(404).json({
                errors: [{ msg: 'Book is not issued' }]
            })
        }

        const issuedBook = allIssuedBooks.find((issued) => issued.book.equals(req.params.bookId));


        if(issuedBook.reissueCount===5){ // if reissue book count is equal to 5 then we will return message for returning that book.
            return res.status(404).json({
                errors: [{ msg: 'You have exhausted the maximum limit of reissue, please return it' }]
            })
        }
        const newReturndate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) //here we are updating new data after reissue
        issuedBook.returnDate=newReturndate; //updating return data as new return date
        issuedBook.reissueCount+=1; // increasing reissue count by 1

        const bookNotification = user.notificationFlags.find((flag) => flag.book.equals(req.params.bookId));

        bookNotification.threeDaysRemaining=false;
        bookNotification.twoDaysRemaining=false;
        bookNotification.lastDay=false;
        bookNotification.expired=false;

        await user.save(); // saving user database

        return res.status(201).json({ msg: 'Book reissued successfully' }); // sending message as book reissued succesfully 

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;