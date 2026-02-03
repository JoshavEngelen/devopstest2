var express = require('express');
var _ = require('underscore');
var router = express();

var mongoose = require('mongoose');
var Teacher = mongoose.model('Teacher');
var Course = mongoose.model('Course');

function getTeachers(req, res){
	var query = {};

	var result = Teacher
		.find(query)
		.populate('courses');
		
	if (req.query.pageSize && req.query.pageIndex) {
		result = result.byPage(req.query.pageSize, req.query.pageIndex);
	}

	result
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: 'Server error', error: err.message });
		});
}

function addTeacher(req, res){
    var teacher = new Teacher(req.body);
    console.log(req.body);
	teacher
		.save()
		.then(savedTeacher => {
			res.status(201);
			res.json(savedTeacher);
		})
		.catch(err => {
			console.log(err);
			if (err.name === 'ValidationError') {
				res.status(400).json(err.errors);
			} else {
				res.status(500).json({ message: 'Server error', error: err.message });
			}
		});
}

// Routing
router.route('/')
	.get(getTeachers)
	.post(addTeacher);

// Export
module.exports = router;
