const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../model/Users');
const Book = require('../model/Book');
const auth=require('../middleware/auth');

const allowedNotificationTypes = ["THREE DAYS","TWO DAYS","LAST DAY","EXPIRED"]; //notification will be send only on these days
/**
 * @description Add notification route which is to be send to the user
 */

router.post('/add-notification',[
    check('message', 'Message is required').not().isEmpty(),
    check('notificationType', 'Notification type is required').not().isEmpty(),
    check('notificationType', 'Invalid notification type').isIn(allowedNotificationTypes), // notification type should be in above allowedNotificationTypes array
    check('bookId', 'bookId is required').not().isEmpty(), //for which book we are sending bookId
],auth,async(req,res)=>{
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {message,notificationType,bookId} = req.body; //acquiring three fields from body

        const book = await Book.findById(bookId); //finding book by its id

        if (!book) { 
            return res.status(404).json({
                errors: [{ msg: 'Book Not Found' }]
            })
        }

        const user = await User.findById(req.user.id).select('-password'); //findin user by its id 
        if (!user) {
            return res.status(404).json({
                errors: [{ msg: 'User Not Found' }]
            })
        }
        // pushing message and notification type in notifications array, it works as queue
        user.notifications.unshift({message,notificationType}); 

        // user.notificationFlags

        //finding book notification type from notificationsflag array of objects by its bookid
        const bookNotification = user.notificationFlags.find((flag) => flag.book.equals(bookId)); 

        //making allnotification type as True to know that notification type is added
        switch (notificationType) {
            case "THREE DAYS":
                bookNotification.threeDaysRemaining=true;
                break;
            case "TWO DAYS":
                bookNotification.twoDaysRemaining=true;
                break;
            case "LAST DAY":
                bookNotification.lastDay=true;
                break;
            case "EXPIRED":
                bookNotification.expired=true;
                break;
        
            default:
                break;
        }

        await user.save();   //save user notification message in database

        res.json(user.notifications);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }

});

/**
 * @description getting notification route
 */

router.get('/get-notification',auth,async(req,res) => {
    try {
        const extractedData = await User.findById(req.user.id).select('notifications -_id'); // extracting notification using user id
        res.json(extractedData.notifications);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

/**
 * @description nootification read route
 */

router.put('/notification-read',auth,async(req,res)=>{
    try {
        const userId=req.user.id;

        const update = await User.updateMany(                           //updating
            { _id: userId },
            { $set: { 'notifications.$[].isNotificationRead': true } } // setting notification as true for every user
        )
        res.json({msg:"Updated Successfully"});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

module.exports=router;