const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Will Do Later arent exactly sure of how we want to set this up completely.
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  // Current company or employee they work for.
  company: {
    type: String
  },
  // If they have their own website
  website: {
    type: String
  },
  // Where they live
  location: {
    type: String
  },
  // Relationship status maybe or like if they are a student???
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String,
  },
  github: {
    type: String
  },
  // Previous companies just like Facebook does it with past work history
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  // Where the user went to high school / college if applicable
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  // So you can find your friend on other social media platforms as well 
  social: {
    youtube: {
      type: String
    },
    instagram: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    }
  },
  // Displays the current date for the user
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);