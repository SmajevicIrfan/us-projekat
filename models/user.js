const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userShema = new Schema({
	rfID: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	balance: {
		type: Number,
		required: true,
		default: 0,
		min: 0
	},
	timeEntered: {
		type: Date,
		required: false,
		default: null
	}
});

userShema.methods.addToBalance = function(amount) {
	console.log(this.balance, Number(amount));
	this.balance = this.balance + Number(amount);
	this.save();
};

userShema.methods.takeFromBalance = function(amount) {
	this.balance = this.balance - Number(amount);
	this.save();
};

userShema.methods.checkin = function() {
	this.timeEntered = Date.now();
	this.save();
}

userShema.methods.checkout = function() {
	const timeSpent = Math.round((Date.now() - this.timeEntered) / 1000 / 10) + 1;
	console.log(timeSpent);
	if (this.balance >= timeSpent) {
		this.balance -= timeSpent;
		this.timeEntered = null;
		this.save();

		return 200;
	}

	return 400;
}

const User = mongoose.model('user', userShema);

module.exports = User;