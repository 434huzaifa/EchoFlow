# EchoFlow - Comment System

A modern, real-time comment system built with React, Redux Toolkit, and WebSocket technology. Users can create, edit, and delete posts with nested comments and replies, complete with like/dislike functionality.

[Live Preview](https://echo-flow-beige.vercel.app/) - it might take some time because of free tire

## Features

- **User Authentication**: Login and signup with email/password
- **Create/Edit/Delete Posts**: Full CRUD operations for posts
- **Nested Comments**: Add comments to posts with threaded replies
- **Like/Dislike System**: Rate comments with like and dislike counts
- **Real-Time Updates**: WebSocket-powered instant updates across all users
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS and Ant Design
- **Lazy Loading**: Load comments on-demand when users click on posts
- **Infinite Scroll**: Browse posts with pagination support

## Tech Stack

**Frontend:**
- React 19
- Redux Toolkit + RTK Query
- Socket.io Client (WebSocket)
- Ant Design (UI Components)
- Tailwind CSS (Styling)
- Vite (Build Tool)
- Sass (CSS Preprocessing)

**Backend:** (Separate repository)
- Node.js / Express
- MongoDB / Mongoose
- Socket.io Server

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd EchoFlow
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
VITE_BACK_END_API=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Replace `http://localhost:5000` with your backend API URL.

## Running the Application

### Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal).

### Production Build

Clone the repository:
```bash
git clone https://github.com/434huzaifa/EchoFlow
cd EchoFlow
```

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

### 1. **Sign Up / Login**
- Navigate to `/login` or `/signup`
- Create an account or login with existing credentials

### 2. **Create a Post**
- On the home page, fill in the post title and content
- Click "Create Post" to submit

### 3. **Interact with Posts**
- **Like/Dislike**: Click the like/dislike icons to rate a post
- **View Comments**: Click the comment icon to load and view comments
- **Edit/Delete**: If you're the author, use the edit/delete icons
- **Add Comment**: Write your thoughts in the comment input box

### 4. **Manage Comments**
- **Add Reply**: Click the reply icon to respond to a comment
- **Like/Dislike Comments**: Rate comments with thumbs up/down
- **Edit/Delete Your Comments**: Manage your own comments

### 5. **Sort Posts**
- Use the sort dropdown to view posts by:
  - Most Liked
  - Most Disliked
  - Newest


[Backend Repository](https://github.com/434huzaifa/EchoFlow_Server)

