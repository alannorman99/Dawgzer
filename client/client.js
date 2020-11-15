
//reference to the form
const form = document.querySelector('form');
//refernce to loading image div
const loadingElement = document.querySelector('.loading');
//element for adding new dawgers to main page
const dawgersElement = document.querySelector('.dawgers');
//url for any request to the db collection
const API_URL = 'http://localhost:5000/dawgers';

loadingElement.style.display = 'none';

//listing all the tweets when the page loads
listAllDawgers();

//event listener for when the form is submitted using the button
form.addEventListener('submit', (event) => {
	//getting the form elements
	event.preventDefault();
	const formData = new FormData(form);
	const name = formData.get('name');
	const content = formData.get('content');

	//saving elements into an object
	const dawger = {
		name,
		content
	};

	//set loading spinner to be visible and replace the form
	form.style.display = 'none';
	loadingElement.style.display = '';

	//fetch to send the dawger to the server/db collection
	fetch(API_URL, {
		method: 'POST',
		body: JSON.stringify(dawger),
		headers: {
			'content-type': 'application/json'
		}
	}).then(res => res.json())
		.then(createdDawger => {
			form.reset();
			setTimeout(() => {
				form.style.display = '';
			}, 30000);
			listAllDawgers();


		});

});

//displays all the tweets(dawgers) from the collection on the main page
function listAllDawgers() {
	//clear the list so it doesn't keep appendng the whole collection of tweets everytime one is posted
	dawgersElement.innerHTML = '';

	//fetch to get all the dawgers from the collection and append them to a div
	fetch(API_URL)
		.then(res => res.json())
		.then(dawgers => {
			console.log(dawgers);
			//display the most recent dawger in the collection first
			dawgers.reverse();
			//loop through the dawgers and append them
			dawgers.forEach(dawger => {
				//div setup
				const div = document.createElement('div');

				//header setup
				const header = document.createElement('h3');
				header.textContent = dawger.name;
				//content setup
				const contents = document.createElement('p');
				contents.textContent = dawger.content;
				//date setup
				const date = document.createElement('small');
				date.textContent = new Date(dawger.created);

				//append them all to the div and display the div
				div.appendChild(header);
				div.appendChild(contents);
				div.appendChild(date);

				dawgersElement.appendChild(div);

			});
			loadingElement.style.display = 'none';
		});
}