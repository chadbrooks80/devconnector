const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

// Import Validators
const validatePostInput = require('../../validation/post');



// Import the Model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @route GET api/posts
// @desc Get all posts
// @access Public
router.get('/', (req, res) => {
  Post.find().sort({ date: -1 }).then(posts => {
    res.json(posts);
  })
    .catch(err => res.status(404).json({ noPostsFound: "No posts Found" }));
});

// @route GET api/posts/:id
// @desc Gets a single post by ID
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id).then(post => {
    res.json(post);
  })
    .catch(err => res.status(404).json({ noPostFound: "No post found with that ID" }));
});




// @route POST api/posts
// @desc Creates New Post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // check validation
  if (!isValid) return res.status(400).json(errors);

  // Note, with Redux it will be keeping the user's information in State
  // which is why we can access it from the req.body..
  // they are not actually typing in their name or anything
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));

  // find user
  User.findOne({ user: req.params.id }).then(user => {
    if (!user) res.status(404).json({ error: "user not fund" });
  })
})

// @route DELETE api/posts/:id
// @desc Deletes a single post by ID
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  // need to find user first to verify they are the owner
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check for post owner
          if (post.user.toString() !== req.user.id) res.status(404).json({ notAuthorized: "User not authorized" })
          post.remove().then(() => { res.json({ success: true }) });
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
    })
});

// @route POST api/posts/like/:id
// @desc Like post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  // need to find user first to verify they are the owner
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          console.log()
          // this is checking if the user liked the post
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyLiked: 'User already liked this post' })
          }
          // Add the user ID to the likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post))
        })
        .catch(err => console.log(err))
    })
});

// @route POST api/posts/unlike/:id
// @desc Unlike post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  // need to find user first to verify they are the owner
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          console.log()
          // this is checking if the user liked the post
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notLiked: 'You have not yet liked this post' })
          }
          // get the remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // splice out of array
          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post));
        })
        .catch(err => console.log(err))
    })
});

// @route POST api/posts/comment/:id
// @desc Add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validatePostInput(req.body);

  // check validation
  if (!isValid) return res.status(400).json(errors);


  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }

      // add to comments array
      post.comments.unshift(newComment);
      post.save()
        .then(post => res.json(post))
    })
    .catch(err => res.status(404).json({ postnotfound: 'No Post found' }));
});

// @route DELETE api/posts/comment/:id/:comment_id
// @desc Remove comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log("comment")

  console.log("postId: " + req.params.id)
  Post.findById(req.params.id)
    .then(post => {
      // check to see if comment exists
      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({ commentnotexists: 'Comment does not exist' });
      }

      // get remove index
      const removeIndex = post
        .comments.map(item => item._id.toString())
        .indexOf(req.params.comment_id);
      console.log({ removeIndex })
      // splice out of array
      post.comments.splice(removeIndex, 1);
      post.save().then(post => res.json(post));

    })
    .catch(err => console.log(err));
  // .catch(err => res.status(404).json({ postnotfound: 'No Post found' }));
});

module.exports = router;

