const mongoose = require('mongoose');
const User = require('../model/User');

mongoose.connect('your_mongodb_connection_string_here', { useNewUrlParser: true, useUnifiedTopology: true });

async function addPostsArrayToUsers() {
  try {
    const result = await User.updateMany(
      { posts: { $exists: false } },
      { $set: { posts: [] } }
    );
    console.log(`Updated ${result.nModified} users`);
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    mongoose.disconnect();
  }
}

addPostsArrayToUsers();
