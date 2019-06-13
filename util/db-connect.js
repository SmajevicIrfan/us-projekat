const mongoose = require('mongoose');
mongoose.connect('mongodb://irfan:iLoveCloud123@ds261096.mlab.com:61096/us-project', {useNewUrlParser: true}, (err) => {
	if (err) {
		console.log('Something went wrong');
		return;
	}

	console.log('All is right in the world');
});