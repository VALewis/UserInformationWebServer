// set up a server with pug

const express = require("express")
const app = express()
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.set('/views')
app.set('view engine', 'pug')

app.listen(3000, () => {
	console.log("listening to 3000")
})



/////////////////////
//file reader

const fs = require("fs")

app.get("/", (req, res) => {
	fs.readFile('users.json', 'utf-8', function(err, data) {
		if (err) {
			throw err;
		}

		let userList = JSON.parse(data);
		res.render('index', {
			userList: userList
		})
	})
})


////////////////////
// search in json for name and return value
app.get("/search", (req, res) => {
	res.render("search", {
		title: "search",
	})
})


app.post("/search", (req, res) => {
	fs.readFile('users.json', 'utf-8', function(err, data) {
		if (err) {
			throw err;
		}
		console.log("reached")
 
		let userMatch = [] // you have to create an empty array so that each match can be pushed into the match. With res.render the loop would stop after the first match.
		let userList = JSON.parse(data);

		for(i = 0; i < userList.length; i++) {
			if(userList[i].firstname.toUpperCase().startsWith(req.body.autocomplete) || userList[i].lastname.toUpperCase().startsWith(req.body.autocomplete) || userList[i].email.toUpperCase().startsWith(req.body.autocomplete)) {
				userMatch.push(userList[i])
			}
		}
		if(userMatch.length > 0) {
			res.send({usermatch: userMatch})
		}
	})
})



app.get("/match", (req, res) => {
	res.render("match", {
		title: "match",
	})
})

app.post("/match", (req, res) => {
	fs.readFile('users.json', 'utf-8', function(err, data) {
		if (err) {
			throw err;
		}

		let userList = JSON.parse(data);
		let ifFound = false
		for (i = 0; i < userList.length; i++) {
			let firstName = userList[i].firstname.toUpperCase()
			let lastName = userList[i].lastname.toUpperCase()
			let emailAddress = userList[i].email
			if (firstName.startsWith(req.body.search.toUpperCase()) || lastName.startsWith(req.body.search.toUpperCase())) {
				console.log('found')
				res.render('match', {
						title: 'match',
						firstName: firstName,
						lastName: lastName,
						emailAddress: emailAddress
					}),
					ifFound = true
				break;
				if (!ifFound) {
					res.send(`Match not found`)
				}

			}
		}
	})
})

// req.body is een term wat alleen aan de server-kant kan worden gebruikt!


// - route 4: renders a page with a form with three inputs on it (first name, last name, and email) 
// that allows you to add new users to the users.json file.

app.get("/create", (req, res) => {
	res.render("create", {
		title: "create",
	})
})


// - route 5: takes in the post request from the 'create user' form, then adds the user 
// to the users.json file. Once that is complete, redirects to the route that displays all your users 
// (from part 0).
app.post("/create", (req, res) => {
			fs.readFile('users.json', 'utf-8', function(err, data) {
				if (err) {
					throw err;
				}
				let arrayObjects = JSON.parse(data)
				let newUser = req.body
				arrayObjects.push(newUser)
				console.log(newUser)

				let newList = JSON.stringify(arrayObjects)

				fs.writeFile('users.json', newList, 'utf-8', function(err) {
					if (err) {
						throw err
					}
					console.log('Done!')
				})

			})
})

