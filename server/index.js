const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require("express-rate-limit");

//create the express app
const app = express();

//use monk to connect to a database/ create one if it doesn't exist
const db = monk('localhost/DawgerDB');
//create collection within db called dawgers to hold tweets
const dawgers = db.get('dawgers');

app.use(cors());
app.use(express.json());


//when server gets a (get) request on the slash route
app.get('/', (req, res) => {
	res.json({
		message: 'Dawger! 🐶 🐕'
	});
});

//list all the items in database within dawgers collection
app.get('/dawgers', (req, res) => {
	//lists all elements in collection as an array
	dawgers
		.find()
		.then(dawgers => {
			res.json(dawgers);
		});
});

//test whether certain criteria are met for each dawger sent to server
function isValidDawger(dawger) {
	//check if name and content are not null and are just spaces
	return dawger.name && dawger.name.toString().trim() != '' && dawger.content && dawger.content.toString().trim() != '';
}

const limiter = rateLimit({
	windowMs: 30 * 1000, //30 seconds
	max: 1
});

app.use(limiter);


//when dawger is sent to server
app.post('/dawgers', (req, res) => {
	//test if the dawger sent has necessary components
	if (isValidDawger(req.body)) {
		//dawger object to append req attributes to
		const dawger = {
			name: req.body.name.toString(),
			content: req.body.content.toString(),
			created: new Date()
		};

		//insert a new dawger req into dawgers collection in db
		dawgers
			.insert(dawger)
			.then(createdDawger => {
				res.json(createdDawger);
			});
	} else {
		//error message if dawger sent is incorrect
		res.status(422);
		res.json({
			message: 'Name and content are required!'
		});
	}
});

//test for server
app.listen(5000, () => {
	console.log('Listening on http://localhost:5000');
});
