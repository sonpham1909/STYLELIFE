StyleLife - Men's Fashion Sales App
A full-stack application for men's fashion sales, designed to provide a seamless shopping experience. Users can browse products, place orders, and make payments, while admins can manage products, orders, and users. The app also features real-time notifications, chat, and image storage via Cloudinary.

Features
User authentication with JWT and OTP email verification.
Product management and order processing for admin users.
Real-time chat and notifications using Socket.IO.
Search and shopping cart functionalities.
Image storage with Cloudinary.
Admin panel for managing users, orders, and products.
Prerequisites
Before setting up the project, ensure the following are installed on your machine:

Node.js (recommended version: 14 or above)
npm or yarn
MongoDB (for local setup) or MongoDB Atlas for cloud database
Firebase for email OTP setup
Installation
Clone the repository:

git clone https://github.com/yourusername/StyleLife.git
Navigate to the project folder:

cd StyleLife
Install the backend dependencies:

If you're using npm:

npm install
Or with yarn:

yarn install
Set up the environment variables:

Create a .env file in the root of the project.
Add the following keys with your Firebase and MongoDB connection details:

JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_url
CLOUDINARY_URL=your_cloudinary_url
FIREBASE_API_KEY=your_firebase_api_key
Start the backend server:


npm start
The backend will run on http://localhost:3000 by default.

Install the frontend dependencies:

Navigate to the frontend folder (if separated) and run the following:


npm install
Run the frontend:

If using React for the web app:


npm start
If using React Native for the mobile app, run the following:


npx react-native run-android   # for Android
npx react-native run-ios       # for iOS
Test the app:
Open the app on your browser or mobile emulator. You should be able to:

Register/login via email (using OTP verification)
Browse and add products to the cart
Complete the order process
Admin panel functionality (for managing users and orders)
Technologies Used
Backend: Node.js, Express.js
Authentication: JWT, Firebase
Real-time Communication: Socket.IO
Database: MongoDB
Cloud Storage: Cloudinary
Frontend: ReactJS (admin panel), React Native (mobile app)
License
This project is open-source and available under the MIT License.

LINK VIDEO DEMO: https://www.loom.com/share/e3112ac792f04175bdbef9736fa06e8a?sid=77cf3de0-8fdb-499b-86f7-0062939bffbc

