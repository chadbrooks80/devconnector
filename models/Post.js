const Schema = require('mongoose').Schema

postsSchema = new Schema({
  user: {
    type: require('mongoose').Schema.Types.ObjectId,
    ref: 'users'
  },

  text: {
    type: String,
    required: true
  },

  name: {
    type: String,
  },
  avatar: {
    type: String
  },

  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  ],

  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.Now
      }
    },

  ],

  date: {
    type: Date,
    default: Date.Now
  }

});

module.exports = Post = require('mongoose').model('post', postsSchema);