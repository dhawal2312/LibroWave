const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new mongoose.Schema({
    message: {
      type: String,
      required: true,
    },
    notificationType:{
        type:String,
        required:true
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isNotificationRead: {
      type: Boolean,
      default: false, // Default value is null until the user reads the notification
    }
  });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    issuedBooks:[
        {
            book:{
                type:Schema.Types.ObjectId,
                ref: 'book',
                required:true
            },
            issueDate: {
                type: Date,
                default: Date.now
            },
            returnDate: {
                type: Date,
                default: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) //time is stored in millisecond
            },
            reissueCount: {
                type: Number,
                default: 0 
            }
        }

    ],
    returnedBooks:[
        {
            book:{
                type:Schema.Types.ObjectId, //specifying its datatype as object and  it contains object id 
                ref: 'book', //referencing current model with book model
                required:true
            },
            returnDate: {
                type: Date,
                default: Date.now 
            }

        }
    ],
    notifications: [
        NotificationSchema //here we are storing notification schema model
    ],
    notificationFlags:[
        {
            book:{
                type:Schema.Types.ObjectId,
                ref:'book',
                required:true
            },
            threeDaysRemaining: { type: Boolean, default: false },
            twoDaysRemaining: { type: Boolean, default: false },
            lastDay: { type: Boolean, default: false },
            expired: { type: Boolean, default: false },
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema);