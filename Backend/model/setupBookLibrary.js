const bookData=require('../assets/bookLibrary');
const bookModel=require('./Book');

const setupDb= async () => {
    try {

        const deletedBooks=await bookModel.deleteMany(); // we are deleting so that redundancy does not occur
        const insertBooks= await bookModel.insertMany(bookData); // again we are inserting the data
        
        if(insertBooks)
            return {message: "Database Initialized"}; //if it is inserted then database will be intitalized
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Data Insertion Failed'); //here we are handling error
    } 
}

module.exports=setupDb;
