const mongoose = require('mongoose')
const express = require('express');

users = require('./routes/api/users');
profiles = require('./routes/api/profiles');
posts = require('./routes/api/posts');

const app = express();

// DB Config
const db = require('./config/keys').mongoURI;

// get users


// Connect to mongo DB
mongoose.connect(db).then(() => console.log("connected!!!!")).catch(err => { console.log(err) })

app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);


app.get('/', (req, res) => res.send("hello world!!"))

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});