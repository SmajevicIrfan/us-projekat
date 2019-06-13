const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.post('/add', async (req, res) => {
	if (!req.body.rfid || !req.body.firstName || !req.body.lastName) {
		return res.status(400).send('All required data not found in header');
	}

	const newUser = new User({
		rfID: req.body.rfid,
		firstName: req.body.firstName,
		lastName: req.body.lastName
	});

	await newUser.save();
	return res.status(200).send('User saved in database');
});

router.post('/addBalance', async (req, res) => {
	if (!req.body.rfid) {
		return res.status(400).send('RFID ID not found in header');
	}

	User.findOne({ rfID: req.body.rfid }, (err, foundUser) => {
		if (err) {
			console.log(err);
			return res.status(400).send('Some error occured');
		}

		if (foundUser === null) {
			return res.status(400).send('User not found');
		}

		foundUser.addToBalance(req.body.amount);
		return res.status(200).send('Balance updated');
	});
});

router.post('/takeBalance', async (req, res) => {
	if (!req.body.rfid) {
		return res.status(400).send('RFID ID not found in header');
	}

	User.findOne({ rfID: req.body.rfid }, (err, foundUser) => {
		if (err) {
			console.log(err);
			return res.status(400).send('Some error occured');
		}

		if (foundUser === null) {
			return res.status(400).send('User not found');
		}

		//User.updateOne({ _id: foundUser._id }, ())

		foundUser.takeFromBalance(req.body.amount);
		return res.status(200).send('Balance updated');
	});
});

router.post('/swipeCard', (req, res) => {
	if (!req.body.rfid) {
		return res.status(403).send('Access Unauthorized');
	}

	User.findOne({ rfID: req.body.rfid }, (err, foundUser) => {
		if (err) {
			console.log(err);
			return res.status(400).send('Some error occured');
		}

		if ('timeEntered' in foundUser && foundUser['timeEntered'] !== null) {
			const code = foundUser.checkout();
			return res.sendStatus(code);
		}

		foundUser.checkin();
		return res.status(200).send('User checked in');
	});
});

router.get('/getUser', (req, res) => {
	if (!req.query.rfid) {
		return res.status(403).send('Access Unauthorized');
	}

	User.findOne({ rfID: req.query.rfid }).lean().exec((err, foundUser) => {
		if (err) {
			console.log(err);
			return res.status(400).send('Some error occured');
		}

		res.status(200).json(foundUser);
	});
});

module.exports = router;