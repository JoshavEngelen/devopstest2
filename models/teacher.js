var mongoose = require('mongoose');
var teacherSchema = new mongoose.Schema({
	_id: { type: String, required: true, lowercase: true },
	firstName: { type: String, required: true },
	middleName: { type: String },
	lastName: { type: String, required: true },
	age: {type: Number, min: 0, max: 100 },
	isActive: { type: Boolean},
	courses: [{ type: String, required: true, ref: 'Course' }]
},
{
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

teacherSchema.query.byPage = function (pageSize, pageIndex) {
    return this.limit(parseInt(pageSize))
        .skip(pageIndex * pageSize);
};

teacherSchema.pre('save', function(){
	console.log('Teacher will be saved');
});

teacherSchema.post('save', function(){
	console.log('Teacher is saved');
});

teacherSchema.path('lastName').validate(function (val) {
    return val && this.firstName != val;
}, 'Last name must differ from first name.');

teacherSchema.virtual('fullName').get(function(){
	var fullName = this.firstName + ' ';
	if(this.middleName && this.middleName.length){
		fullName += this.middleName + ' ';
	}
	fullName += this.lastName;

	return fullName;
});	

mongoose.model('Teacher', teacherSchema);

