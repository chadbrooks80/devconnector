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
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
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
        default: Date.now
      }
    },

  ],

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = Post = require('mongoose').model('post', postsSchema);