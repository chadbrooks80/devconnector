const mongoose = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');


users = require('./routes/api/users');
profile = require('./routes/api/profile');
posts = require('./routes/api/posts');

const app = express();

//  Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// DB Config
const db = require('./config/keys').mongoURI;

// get users


// Connect to mongo DB
//  { useNewUrlParser: true } was passed due to mongoose giving me a depreciated warning but it wasn't part
// of the course. 
mongoose.connect(db, { useNewUrlParser: true }).then(() => console.log("connected!!!!")).catch(err => { console.log(err) })

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//  passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

// Use Routes
app.use("/api/users", users)
app.use("/api/profile", profile)
app.use("/api/posts", posts)

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});