import mongoose from 'mongoose';

import { Comment } from "./schema/comment.model.js";
import { Post } from "./schema/post.model.js";
import { User } from "./schema/user.model.js";

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = 'mongodb+srv://saip01798:side@cluster0.q6zoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Simple image URL (using a reliable placeholder)
const IMAGE_URL = "https://picsum.photos/400/400";

// Sample captions for posts
const POST_CAPTIONS = [
  "Living my best life! ✨",
  "Another beautiful day in paradise 🌅",
  "Good vibes only 🌈",
  "Making memories that last forever 💫",
  "Chasing dreams and catching sunsets 🌇",
  "Life is what you make it 💪",
  "Adventure awaits! 🗺️",
  "Grateful for this moment 🙏",
  "Creating my own sunshine ☀️",
  "Living in the moment 📸",
  "Best day ever! 🎉",
  "Finding joy in the little things ❤️",
  "New day, new possibilities 🌟",
  "Blessed and grateful 🍀",
  "Making it happen! 💯",
  "Life's a beautiful journey 🛤️",
  "Spreading good energy 🔆",
  "Today was amazing! 😊",
  "Living with purpose 🎯",
  "Every moment is precious ⏰"
];

// Sample comment texts
const COMMENT_TEXTS = [
  "Amazing! 😍",
  "Love this!",
  "So beautiful! ✨",
  "Goals! 💯",
  "This is incredible!",
  "Wow! 🔥",
  "Absolutely stunning!",
  "You're amazing!",
  "Perfect shot! 📸",
  "Living for this!"
];

class SocialMediaSeeder {
  constructor() {
    this.users = [];
    this.posts = [];
    this.comments = [];
  }

  async connect() {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  async loadExistingUsers() {
    try {
      const existingUsers = await User.find({});
      console.log(`📊 Found ${existingUsers.length} existing users in database`);
      return existingUsers;
    } catch (error) {
      console.error('❌ Error loading existing users:', error);
      return [];
    }
  }

  getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  async createPostsForUsers(allUsers) {
    console.log('📝 Creating posts for users who have none...');
    
    try {
      // Find users who don't have posts yet
      const usersWithoutPosts = [];
      
      for (const user of allUsers) {
        const userWithPosts = await User.findById(user._id).populate('posts');
        if (!userWithPosts.posts || userWithPosts.posts.length === 0) {
          usersWithoutPosts.push(user);
        }
      }

      console.log(`👤 Found ${usersWithoutPosts.length} users without posts`);

      for (let i = 0; i < usersWithoutPosts.length; i++) {
        const user = usersWithoutPosts[i];
        
        try {
          const post = new Post({
            caption: POST_CAPTIONS[i % POST_CAPTIONS.length],
            image: IMAGE_URL,
            author: user._id,
            likes: [],
            comments: []
          });

          // Add random likes (2-5 likes per post)
          const likeCount = Math.floor(Math.random() * 4) + 2;
          const usersWhoLiked = this.getRandomElements(
            allUsers.filter(u => u._id.toString() !== user._id.toString()), 
            Math.min(likeCount, allUsers.length - 1)
          );
          post.likes = usersWhoLiked.map(u => u._id);

          const savedPost = await post.save();
          this.posts.push(savedPost);

          // Add post to user's posts array
          await User.findByIdAndUpdate(user._id, {
            $push: { posts: savedPost._id }
          });

          console.log(`✅ Created post for: ${user.username}`);
        } catch (postError) {
          console.error(`❌ Error creating post for ${user.username}:`, postError.message);
        }
      }

      console.log(`📝 Successfully created ${this.posts.length} posts`);
      
    } catch (error) {
      console.error('❌ Error in createPostsForUsers:', error);
    }
  }

  async createCommentsForPosts(allUsers) {
    console.log('💬 Creating comments for posts...');
    
    try {
      // Get all posts that don't have comments yet
      const postsWithoutComments = await Post.find({ 
        $or: [
          { comments: { $exists: false } },
          { comments: { $size: 0 } }
        ]
      });

      console.log(`📄 Found ${postsWithoutComments.length} posts without comments`);

      for (const post of postsWithoutComments) {
        const postComments = [];
        
        // Create 3-5 comments for each post
        const commentCount = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < commentCount; i++) {
          try {
            const randomUser = this.getRandomElement(allUsers);
            const commentText = this.getRandomElement(COMMENT_TEXTS);
            
            const comment = new Comment({
              text: commentText,
              author: randomUser._id,
              post: post._id,
              parentComment: null  // Explicitly set to null
            });

            const savedComment = await comment.save();
            postComments.push(savedComment);
            this.comments.push(savedComment);
            
          } catch (commentError) {
            console.error(`❌ Error creating comment:`, commentError.message);
          }
        }

        // Update post with comment IDs
        if (postComments.length > 0) {
          await Post.findByIdAndUpdate(post._id, {
            comments: postComments.map(c => c._id)
          });
        }
        
        console.log(`💬 Created ${postComments.length} comments for post`);
      }

      console.log(`💬 Successfully created ${this.comments.length} comments total`);
      
    } catch (error) {
      console.error('❌ Error in createCommentsForPosts:', error);
    }
  }

  async seed() {
    try {
      await this.connect();
      
      // Load all existing users
      const allUsers = await this.loadExistingUsers();
      
      if (allUsers.length === 0) {
        console.log('❌ No users found in database. Please run the user creation script first.');
        return;
      }
      
      // Create posts for users who don't have any
      await this.createPostsForUsers(allUsers);
      
      // Create comments for posts that don't have any
      await this.createCommentsForPosts(allUsers);
      
      console.log('\n🎉 Post and comment seeding completed!');
      console.log(`📊 Summary:`);
      console.log(`   • Created ${this.posts.length} new posts`);
      console.log(`   • Created ${this.comments.length} new comments`);
      
    } catch (error) {
      console.error('❌ Error seeding database:', error);
    } finally {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the seeder
const seeder = new SocialMediaSeeder();
seeder.seed();