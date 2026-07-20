# 💬 Real-Time Chat Application

A modern, responsive, full-stack web-based messaging platform built with **React JS**, **Node.js**, **Express.js**, **MongoDB**, and **Socket.IO**. Designed for instant, seamless communication with features like real-time updates, online/offline status, typing indicators, rich media sharing, and secure JWT authentication.

---

## 📌 Project Overview

The primary objective of this project is to demonstrate practical full-stack web development and modern React JS concepts including component-based architecture, React Hooks, Context API state management, client-side routing, RESTful API integration, dynamic UI design, and real-time bidirectional communication.

The platform enables users to securely register, log in, discover other users, and engage in real-time one-to-one messaging without requiring page refreshes—delivering a smooth experience comparable to popular platforms like WhatsApp, Messenger, and Discord.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Secure Registration & Login**: JWT (JSON Web Token) based user session management.
- **Password Encryption**: Industry-standard password hashing using `bcrypt.js` prior to database storage.
- **Form Validation & Error Handling**: Robust client-side and server-side validation for seamless user onboarding.

### ⚡ Real-Time Messaging & Chat Experience
- **Instant Messaging**: Socket.IO powered bidirectional real-time message delivery with zero latency.
- **Online/Offline Status**: Live user status indicators showing active/inactive state.
- **Typing Indicators**: Real-time feedback when the conversation partner is typing.
- **Chat History**: Persistent message history retrieved seamlessly from MongoDB.
- **Unread Notifications**: Badges and indicators for unread incoming messages.

### 🎨 Rich Media & Customization
- **Emoji Support**: Integrated emoji picker for expressive messaging.
- **File & Image Sharing**: Ability to upload and share multimedia assets and documents.
- **Message Timestamps**: Exact date and time tracking for each sent and received message.
- **Dark/Light Mode**: Dynamic theme switching for customized visual comfort.
- **Responsive & Mobile-Friendly UI**: Optimized layout for smartphones, tablets, and desktop displays.

### 👤 Profile & User Management
- **User Search**: Instant user lookup by username or name to initiate conversations.
- **Profile Management**: Profile picture upload, status updating, and personal info management.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: React JS (v18+)
- **Routing**: React Router DOM
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext`, `useReducer`) & Context API
- **Styling**: Tailwind CSS & CSS3
- **Icons & Assets**: Lucide React / React Icons
- **Real-Time Client**: Socket.IO Client

### **Backend**
- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Real-Time Engine**: Socket.IO Server
- **Authentication**: JSON Web Token (JWT) & bcrypt.js

### **Database**
- **Database**: MongoDB (MongoDB Atlas / Local instance)
- **ODM**: Mongoose

---

## 📁 Project Structure

```
fsd-2-project/
├── client/                     # React JS Frontend Application
│   ├── public/                 # Static assets
│   └── src/
│       ├── assets/             # Images, icons, and media
│       ├── components/         # Reusable UI components (Sidebar, ChatBox, Navbar, etc.)
│       ├── context/            # React Context providers (AuthContext, ChatContext, SocketContext)
│       ├── hooks/              # Custom React hooks
│       ├── pages/              # App views (Login, Register, Chat Dashboard, Profile)
│       ├── services/           # API integration (Axios / Fetch services)
│       ├── utils/              # Helper functions and formatters
│       ├── App.js              # Root component & Route declarations
│       └── main.js             # Entry point
│
├── server/                     # Node.js & Express Backend Application
│   ├── config/                 # DB connection and environment configs
│   ├── controllers/            # API request handlers (auth, user, message, profile)
│   ├── middleware/             # Auth middleware (JWT validation), upload middleware
│   ├── models/                 # Mongoose schemas (User, Message, Conversation)
│   ├── routes/                 # Express API routes
│   ├── sockets/                # Socket.IO connection handling & event listeners
│   ├── utils/                  # Helper utilities (token generator, password hash)
│   └── server.js               # Entry point for backend server & Socket.IO
│
└── README.md                   # Documentation
```

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### 📋 Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas Connection URI)

---

### ⚙️ Environment Configuration

1. **Backend Environment Variables (`server/.env`)**:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chat_db
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=http://localhost:3000
   ```

2. **Frontend Environment Variables (`client/.env`)**:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

---

### 📥 Installation & Running

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/fsd-2-project.git
cd fsd-2-project
```

#### 2. Setup Backend Server
```bash
cd server
npm install
npm run dev
# Server will run on http://localhost:5000
```

#### 3. Setup Frontend Client
```bash
# Open a new terminal window
cd client
npm install
npm start
# Client will run on http://localhost:3000
```

---

## 📡 API Endpoints & Socket Events

### 🔑 Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user details | Private |

### 💬 Message Routes (`/api/messages`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages/:userId` | Get chat history with a specific user | Private |
| `POST` | `/api/messages/send` | Send a message (Text/File URL) | Private |

### 👤 User Routes (`/api/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/search?q=` | Search for registered users | Private |
| `PUT` | `/api/users/profile` | Update profile information & picture | Private |

---

### ⚡ Socket.IO Event Handlers
- **`connection`**: Triggered when client establishes a WebSocket connection.
- **`user_online`**: Broadcasts user presence upon login.
- **`send_message`**: Sends a real-time message payload to a specific socket ID / user room.
- **`receive_message`**: Listens for incoming real-time messages.
- **`typing` & `stop_typing`**: Broadcasts active typing state to recipient.
- **`disconnect`**: Updates online status when user disconnects.

---

## 💡 Key Learnings & Academic Significance

This project demonstrates core competencies in modern full-stack development:
- **Component-driven Architecture**: Building reusable, modular React components.
- **State Management & Hooks**: Effectively handling complex application state via Context API and React Hooks.
- **Real-Time Web Sockets**: Implementing bi-directional communication using Socket.IO for event-driven updates.
- **RESTful API Design**: Creating structured, scalable backend routes with Express.js.
- **Security & Data Integrity**: Implementing password encryption, JWT authentication, and input sanitization.
- **Database Modeling**: Designing efficient schemas in MongoDB using Mongoose.

---

## 🔮 Future Enhancements

- [ ] Group Chat functionality with admin privileges.
- [ ] End-to-End Encryption (E2EE) for messages.
- [ ] Voice and Video Calling via WebRTC.
- [ ] Message reactions, voice notes, and read receipts (double checkmarks).
- [ ] Push notifications for offline users.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).