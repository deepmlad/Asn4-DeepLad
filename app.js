/****************************************************************************** *** 
*	ITE5315 – Assignment 4 
*	I declare that this assignment is my own work in accordance with Humber Academic Policy.   
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including web sites) or distributed to other students. 
*  
*	Name: Deep Manish Lad Student ID: N01582108 Date: 27-03-2024 
* 
* 
******************************************************************************
**/  


var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

var Employee = require('./models/employee');
var Book = require("./models/book");

//get all employee data from db
app.get('/api/employees', function(req, res) {
	// use mongoose to get all todos in the database
	Employee.find()
        .then(employees => {
            // Send the retrieved employees as JSON response
            res.json(employees);
        })
        .catch(err => {
            // Handle any errors that occur during the operation
            res.status(500).send(err);
        });
});

// get a employee with ID of 1
app.get('/api/employees/:employee_id', function(req, res) {
	let id = req.params.employee_id;
    Employee.findById(id)
        .then(employee => {
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            // Send the retrieved employee as JSON response
            res.json(employee);
        })
        .catch(err => {
            // Handle any errors that occur during the operation
            res.status(500).send(err);
        });
});

// create employee and send back all employees after creation
app.post('/api/employees', function(req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

	Employee.create({
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age
    })
    .then(employee => {
        // Newly created employee
        console.log('New employee:', employee);
        // Fetch and return all employees
        return Employee.find();
    })
    .then(employees => {
        // All employees
        res.json(employees);
    })
    .catch(err => {
        // Error handling
        res.status(500).send(err);
    });
    
 
});

// create employee and send back all employees after creation
app.put('/api/employees/:employee_id', function(req, res) {
	// create mongose method to update an existing record into collection
    console.log(req.body);

	let id = req.params.employee_id;
	var data = {
		name : req.body.name,
		salary : req.body.salary,
		age : req.body.age
	}

	// save the user
	Employee.findByIdAndUpdate(id, data)
        .then(employee => {
            if (!employee) {
                // If employee is not found, send a 404 response
                res.status(404).send('Employee not found');
            } else {
                // Send success response
                res.send('Successfully! Employee updated - ' + employee.name);
            }
        })
        .catch(err => {
            // Handle any errors that occur during the operation
            res.status(500).send(err);
        });
});

// delete a employee by id
app.delete('/api/employees/:employee_id', function(req, res) {
	console.log(req.params.employee_id);
	let id = req.params.employee_id;
	Employee.deleteOne({ _id: id })
        .then(result => {
            if (result.deletedCount === 0) {
                // If no document was deleted, it means the employee was not found
                res.status(404).send('Employee not found');
            } else {
                // Send success response
                res.send('Successfully! Employee has been Deleted.');
            }
        })
        .catch(err => {
            // Handle any errors that occur during the delete operation
            res.status(500).send(err);
        });
});

// ------------------------------------------Question 2-------------------------------------------

//get all books data from db
app.get('/books', function(req, res) {
	// use mongoose to get all todos in the database
	Book.find()
        .then(book => {
            // Send the retrieved books as JSON response
            res.json(book);
        })
        .catch(err => {
            // Handle any errors that occur during the operation
            res.status(500).send(err);
        });
});

// get a book with ID 
app.get('/books/:id', function(req, res) {
	let id = req.params.id;
    console.log(id);
    Book.findById(id)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }
            // Send the retrieved books as JSON response
            res.json(book);
        })
        .catch(err => {
            // Handle any errors that occur during the operation
            res.status(500).send(err);
        });
});

// Route to insert a new book
app.post('/book', async (req, res) => {
    try {
        // Create a new Book instance with data from the request body
        const book = new Book({
            title : req.body.title,
            author: req.body.author,
            price : req.body.price,
            price_used : req.body.price_used,
            pages : req.body.pages,
            avg_reviews: req.body.avg_reviews,
            n_reviews: req.body.n_reviews,
            star: req.body.star,
            dimensions: req.body.dimensions,
            weight: req.body.weight,
            language: req.body.language,
            publisher: req.body.publisher,
            ISBN_13: req.body.isbn,
            complete_link: req.body.link
        });

        // Save the new book to the database
        const newBook = await book.save();

        // Return the newly created book as the response
        res.status(201).json(newBook);
    } catch (error) {
        // If an error occurs, return a 400 Bad Request status with the error message
        res.status(400).json({ message: error.message });
    }
});

// delete a book by id
app.delete('/books/remove/:id', function(req, res) {
	let id = req.params.id;
	Book.deleteOne({ _id: id })
        .then(result => {
            if (result.deletedCount === 0) {
                // If no document was deleted, it means the book was not found
                res.status(404).send('Book not found');
            } else {
                // Send success response
                res.send('Successfully! Book has been Deleted.');
            }
        })
        .catch(err => {
            // Handle any errors that occur during the delete operation
            res.status(500).send(err);
        });
});

// create boook and send back all book after creation
app.put('/books/update/:id', function(req, res) {

	let id = req.params.id;
	var data = {
		title : req.body.title,
		price : req.body.price
	}

	// save the book
	Book.findByIdAndUpdate(id, data)
        .then(book => {
            if (!book) {
                // If book is not found, send a 404 response
                res.status(404).send('Book not found');
            } else {
                // Send success response
                res.send('Successfully! Book updated - ' + book.title);
            }
        })
        .catch(err => {
            // Handle any errors that occur during the operation
            res.status(500).send(err);
        });
});

app.listen(port);
console.log("App listening on port : " + port);
