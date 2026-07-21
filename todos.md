# 📋 Daily TODOs — Real-Time Chat Application

> A 14-day, step-by-step development roadmap with detailed daily TODOs.
> Each day targets ~3–5 hours of focused work.

---

## 📅 Day 1 — Project Initialization & Repository Setup

**Goal:** Set up the monorepo structure, initialize both frontend and backend projects, install all dependencies, and configure environment variables.

---

### TODO 1.1 — Initialize Git Repository *(15 min)*

- [ ] Create the root project folder `fsd-2-project/`
- [ ] Run `git init` inside the root folder
- [ ] Create a `.gitignore` file at the root with entries for:
  - `node_modules/`
  - `.env`
  - `dist/`
  - `build/`
  - `uploads/`
  - `.DS_Store`
- [ ] Make an initial commit: `git commit -m "chore: initialize project"`

### TODO 1.2 — Set Up Backend (Node.js / Express) *(45 min)*

- [ ] Create the `server/` directory
- [ ] Inside `server/`, run `npm init -y` to generate `package.json`
- [ ] Install production dependencies:
  ```
  npm install express mongoose dotenv cors jsonwebtoken bcryptjs socket.io multer express-validator
  ```
- [ ] Install dev dependencies:
  ```
  npm install -D nodemon
  ```
- [ ] Add scripts to `server/package.json`:
  ```json
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
  ```
- [ ] Create the following empty directory structure inside `server/`:
  ```
  server/
  ├── config/
  ├── controllers/
  ├── middleware/
  ├── models/
  ├── routes/
  ├── sockets/
  ├── utils/
  └── uploads/
  ```
- [ ] Create `server/.env` file with placeholder values:
  ```
  PORT=5000
  MONGO_URI=mongodb://localhost:27017/chatapp
  JWT_SECRET=your_super_secret_key_here
  CLIENT_URL=http://localhost:5173
  NODE_ENV=development
  ```
- [ ] Create a minimal `server/server.js` that:
  - Loads dotenv
  - Creates an Express app
  - Adds `cors()`, `express.json()` middleware
  - Listens on `PORT` with a console log confirmation
- [ ] Test: Run `npm run dev` and verify "Server running on port 5000" appears

### TODO 1.3 — Set Up Frontend (React + Vite) *(45 min)*

- [ ] From the root directory, scaffold the frontend using Vite:
  ```bash
  npm create vite@latest client -- --template react
  ```
- [ ] `cd client` and run `npm install`
- [ ] Install additional frontend dependencies:
  ```
  npm install react-router-dom axios socket.io-client emoji-picker-react lucide-react react-hot-toast
  ```
- [ ] Install Tailwind CSS v3:
  ```
  npm install -D tailwindcss @tailwindcss/vite
  ```
- [ ] Configure Tailwind:
  - Add `@tailwindcss/vite` plugin to `vite.config.js`
  - Add `@import "tailwindcss";` to `src/index.css`
- [ ] Create the following directory structure inside `client/src/`:
  ```
  src/
  ├── assets/
  ├── components/
  │   ├── chat/
  │   ├── common/
  │   └── sidebar/
  ├── context/
  ├── hooks/
  ├── pages/
  ├── services/
  └── utils/
  ```
- [ ] Create `client/.env` with:
  ```
  VITE_API_URL=http://localhost:5000/api
  VITE_SOCKET_URL=http://localhost:5000
  ```
- [ ] Test: Run `npm run dev` and verify the default Vite React page loads at `http://localhost:5173`

### TODO 1.4 — Create Shared Configuration Files *(30 min)*

- [ ] Create `server/config/db.js`:
  - Import `mongoose`
  - Export an async `connectDB` function that calls `mongoose.connect(process.env.MONGO_URI)`
  - Add try/catch with `console.error` and `process.exit(1)` on failure
- [ ] Create `server/config/config.js`:
  - Export all environment variables as named constants: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV`
- [ ] Update `server/server.js` to:
  - Import and call `connectDB()` before `server.listen()`
  - Log "MongoDB connected" on success
- [ ] Test: Start the backend and verify both "MongoDB connected" and "Server running" logs appear

### TODO 1.5 — Commit & Push *(10 min)*

- [ ] Stage all files: `git add .`
- [ ] Commit: `git commit -m "feat: project initialization with frontend & backend setup"`
- [ ] Push to remote repository (GitHub)

---

**✅ Day 1 Verification Checklist:**
- [ ] Backend starts without errors on port 5000
- [ ] MongoDB connection succeeds (local or Atlas)
- [ ] Frontend starts without errors on port 5173
- [ ] All directories created and empty
- [ ] `.env` files created with correct variables

---
---

## 📅 Day 2 — Database Models & Utility Functions

**Goal:** Define all three Mongoose schemas (User, Conversation, Message) and create utility helper functions for JWT and password hashing.

---

### TODO 2.1 — User Model (`server/models/User.js`) *(45 min)*

- [ ] Import `mongoose` and `bcryptjs`
- [ ] Define `userSchema` with the following fields:
  - `name`: String, required, trim, minLength 2
  - `email`: String, required, unique, lowercase, trim, validated with regex
  - `password`: String, required, minLength 6, `select: false`
  - `profilePic`: String, default `""`
  - `status`: String, maxLength 140, default `"Hey there! I'm using ChatApp"`
  - `isOnline`: Boolean, default `false`
  - `lastSeen`: Date, default `Date.now`
- [ ] Enable `timestamps: true` option on the schema
- [ ] Add a `pre('save')` middleware hook:
  - Check if `password` field is modified (`this.isModified('password')`)
  - If yes, generate a salt with `bcrypt.genSalt(10)` and hash the password
- [ ] Add an instance method `matchPassword(enteredPassword)`:
  - Returns `bcrypt.compare(enteredPassword, this.password)`
- [ ] Export the model: `mongoose.model('User', userSchema)`
- [ ] Verify: No syntax errors when importing the model

### TODO 2.2 — Conversation Model (`server/models/Conversation.js`) *(30 min)*

- [ ] Define `conversationSchema` with:
  - `participants`: Array of ObjectId, ref `'User'`, required, validate array length === 2
  - `lastMessage`: ObjectId, ref `'Message'`, default `null`
- [ ] Enable `timestamps: true`
- [ ] Add a compound index on `participants` for fast lookup:
  ```javascript
  conversationSchema.index({ participants: 1 });
  ```
- [ ] Export the model

### TODO 2.3 — Message Model (`server/models/Message.js`) *(30 min)*

- [ ] Define `messageSchema` with:
  - `conversationId`: ObjectId, ref `'Conversation'`, required
  - `sender`: ObjectId, ref `'User'`, required
  - `receiver`: ObjectId, ref `'User'`, required
  - `text`: String, default `""`
  - `fileUrl`: String, default `""`
  - `fileType`: String, enum `['image', 'video', 'document', '']`, default `""`
  - `isRead`: Boolean, default `false`
- [ ] Enable `timestamps: true` (only `createdAt` is meaningful for messages)
- [ ] Add a compound index for efficient message retrieval:
  ```javascript
  messageSchema.index({ conversationId: 1, createdAt: 1 });
  ```
- [ ] Export the model

### TODO 2.4 — Utility: JWT Token Generator (`server/utils/generateToken.js`) *(15 min)*

- [ ] Import `jsonwebtoken`
- [ ] Export a function `generateToken(userId)` that:
  - Calls `jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })`
  - Returns the token string

### TODO 2.5 — Utility: Password Helpers (`server/utils/hashPassword.js`) *(15 min)*

- [ ] Import `bcryptjs`
- [ ] Export `hashPassword(password)`:
  - Generate salt with rounds = 10
  - Return hashed password
- [ ] Export `comparePassword(entered, hashed)`:
  - Return `bcrypt.compare(entered, hashed)`
- [ ] *(Note: These are utility alternatives if not using schema-level pre-save hooks)*

### TODO 2.6 — Commit *(5 min)*

- [ ] `git add . && git commit -m "feat: add database models and utility functions"`

---

**✅ Day 2 Verification Checklist:**
- [ ] All three models can be imported without errors
- [ ] User model pre-save hook hashes passwords correctly (test with a quick script)
- [ ] Indexes are defined on Conversation and Message models
- [ ] Utility functions export correctly

---
---

## 📅 Day 3 — Authentication Backend (Register, Login, JWT Middleware)

**Goal:** Build the complete authentication system — register endpoint, login endpoint, JWT middleware, and the "get current user" endpoint.

---

### TODO 3.1 — Auth Middleware (`server/middleware/authMiddleware.js`) *(30 min)*

- [ ] Import `jsonwebtoken` and `User` model
- [ ] Export an async `protect` middleware function that:
  1. Reads the `Authorization` header
  2. Checks it starts with `'Bearer '`
  3. Extracts the token string
  4. Calls `jwt.verify(token, process.env.JWT_SECRET)` to decode
  5. Finds the user: `User.findById(decoded.userId).select('-password')`
  6. Attaches the user to `req.user`
  7. Calls `next()`
  8. On any error → responds with `401 { message: 'Not authorized, token failed' }`

### TODO 3.2 — Auth Controller (`server/controllers/authController.js`) *(60 min)*

- [ ] **`register` handler:**
  1. Extract `name`, `email`, `password` from `req.body`
  2. Validate all fields are present → 400 error if missing
  3. Check if user already exists (`User.findOne({ email })`) → 400 error if exists
  4. Create new user: `User.create({ name, email, password })`
  5. Generate JWT token using `generateToken(user._id)`
  6. Respond with `201 { success: true, user: { _id, name, email, profilePic, status }, token }`

- [ ] **`login` handler:**
  1. Extract `email`, `password` from `req.body`
  2. Find user with password: `User.findOne({ email }).select('+password')`
  3. If no user → 401 `'Invalid email or password'`
  4. Compare password using `user.matchPassword(password)`
  5. If mismatch → 401 `'Invalid email or password'`
  6. Generate JWT token
  7. Respond with `200 { success: true, user: { ... }, token }`

- [ ] **`getMe` handler:**
  1. Uses `req.user` (set by auth middleware)
  2. Respond with `200 { success: true, user: req.user }`

### TODO 3.3 — Auth Routes (`server/routes/authRoutes.js`) *(15 min)*

- [ ] Import express Router, auth controller functions, and `protect` middleware
- [ ] Define routes:
  - `POST /register` → `register`
  - `POST /login` → `login`
  - `GET /me` → `protect`, `getMe`
- [ ] Export the router

### TODO 3.4 — Global Error Handler (`server/middleware/errorHandler.js`) *(20 min)*

- [ ] Create an error handling middleware with signature `(err, req, res, next)`
- [ ] Log the error stack in development
- [ ] Handle Mongoose-specific errors:
  - `CastError` → 400 `'Resource not found'`
  - Duplicate key error (code 11000) → 400 `'Duplicate field value'`
  - `ValidationError` → 400 with field-specific messages
- [ ] Default: 500 `'Internal Server Error'`
- [ ] Always respond with JSON: `{ success: false, message }`

### TODO 3.5 — Mount Routes in server.js *(15 min)*

- [ ] Import `authRoutes`
- [ ] Mount: `app.use('/api/auth', authRoutes)`
- [ ] Import and attach `errorHandler` as the last middleware
- [ ] Verify CORS is configured with `origin: process.env.CLIENT_URL`

### TODO 3.6 — Test Auth Endpoints *(30 min)*

- [ ] Use Postman, Thunder Client, or `curl` to test:
  - **Register:** POST `/api/auth/register` with `{ name, email, password }` → expect 201 + token
  - **Register duplicate:** Same email → expect 400
  - **Login:** POST `/api/auth/login` with correct creds → expect 200 + token
  - **Login wrong password:** → expect 401
  - **Get Me:** GET `/api/auth/me` with `Authorization: Bearer <token>` → expect user object
  - **Get Me no token:** → expect 401
- [ ] Verify the password stored in MongoDB is hashed (not plaintext)

### TODO 3.7 — Commit *(5 min)*

- [ ] `git commit -m "feat: implement authentication system (register, login, JWT)"`

---

**✅ Day 3 Verification Checklist:**
- [ ] Register creates user with hashed password in DB
- [ ] Login returns valid JWT token
- [ ] Protected route `/me` works with valid token
- [ ] Protected route returns 401 without token
- [ ] Error handler catches and formats all error types

---
---

## 📅 Day 4 — User & Message Backend APIs

**Goal:** Build the user search, profile update, message sending, and message retrieval endpoints.

---

### TODO 4.1 — User Controller (`server/controllers/userController.js`) *(45 min)*

- [ ] **`searchUsers` handler:**
  1. Extract query param `q` from `req.query`
  2. If `q` is empty → return empty array
  3. Search users using regex:
     ```javascript
     User.find({
       $or: [
         { name: { $regex: q, $options: 'i' } },
         { email: { $regex: q, $options: 'i' } }
       ],
       _id: { $ne: req.user._id }  // Exclude self
     }).select('name email profilePic status isOnline')
     ```
  4. Return the results array

- [ ] **`updateProfile` handler:**
  1. Extract `name`, `status` from `req.body`
  2. If `req.file` exists (profile pic upload), build the file URL
  3. Find user and update:
     ```javascript
     User.findByIdAndUpdate(req.user._id, updateFields, { new: true, runValidators: true })
     ```
  4. Return updated user object

### TODO 4.2 — User Routes (`server/routes/userRoutes.js`) *(10 min)*

- [ ] Define routes (all protected with `protect` middleware):
  - `GET /search` → `searchUsers`
  - `PUT /profile` → `uploadMiddleware`, `updateProfile`
- [ ] Export the router

### TODO 4.3 — Message Controller (`server/controllers/messageController.js`) *(60 min)*

- [ ] **`getMessages` handler:**
  1. Extract `userId` from `req.params` (the other user's ID)
  2. Find or confirm the conversation between `req.user._id` and `userId`:
     ```javascript
     Conversation.findOne({
       participants: { $all: [req.user._id, userId] }
     })
     ```
  3. If no conversation exists → return `{ conversationId: null, messages: [] }`
  4. Fetch messages sorted by `createdAt` ascending:
     ```javascript
     Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 })
     ```
  5. Optionally mark received messages as read:
     ```javascript
     Message.updateMany(
       { conversationId, receiver: req.user._id, isRead: false },
       { isRead: true }
     )
     ```
  6. Return `{ conversationId, messages }`

- [ ] **`sendMessage` handler:**
  1. Extract `receiverId`, `text`, `fileUrl`, `fileType` from `req.body`
  2. Validate: at least `text` or `fileUrl` must be provided
  3. Find existing conversation or create new one:
     ```javascript
     let conversation = await Conversation.findOne({
       participants: { $all: [req.user._id, receiverId] }
     });
     if (!conversation) {
       conversation = await Conversation.create({
         participants: [req.user._id, receiverId]
       });
     }
     ```
  4. Create the message document:
     ```javascript
     Message.create({
       conversationId: conversation._id,
       sender: req.user._id,
       receiver: receiverId,
       text, fileUrl, fileType
     })
     ```
  5. Update conversation's `lastMessage`:
     ```javascript
     conversation.lastMessage = message._id;
     await conversation.save();
     ```
  6. Return the created message with `201` status

### TODO 4.4 — Message Routes (`server/routes/messageRoutes.js`) *(10 min)*

- [ ] Define routes (all protected):
  - `GET /:userId` → `getMessages`
  - `POST /send` → `sendMessage`
- [ ] Export the router

### TODO 4.5 — Upload Middleware (`server/middleware/uploadMiddleware.js`) *(30 min)*

- [ ] Import `multer` and `path`
- [ ] Configure `multer.diskStorage`:
  - `destination`: `'uploads/'`
  - `filename`: `Date.now() + '-' + file.originalname`
- [ ] Add file filter:
  - Allow MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `video/mp4`, `application/pdf`
  - Reject others with error
- [ ] Set limits: `fileSize: 5 * 1024 * 1024` (5 MB)
- [ ] Export `upload.single('file')` middleware

### TODO 4.6 — Mount All Routes in server.js *(10 min)*

- [ ] Import `userRoutes` and `messageRoutes`
- [ ] Mount:
  - `app.use('/api/users', userRoutes)`
  - `app.use('/api/messages', messageRoutes)`
- [ ] Add static file serving: `app.use('/uploads', express.static('uploads'))`

### TODO 4.7 — Test All Endpoints *(30 min)*

- [ ] **User Search:** GET `/api/users/search?q=test` → returns matching users
- [ ] **Profile Update:** PUT `/api/users/profile` with form-data → returns updated user
- [ ] **Send Message:** POST `/api/messages/send` with `{ receiverId, text }` → creates message
- [ ] **Get Messages:** GET `/api/messages/:userId` → returns message array
- [ ] **Verify MongoDB:** Check that Conversation and Message documents are created correctly
- [ ] **Verify:** Messages are sorted chronologically

### TODO 4.8 — Commit *(5 min)*

- [ ] `git commit -m "feat: add user search, profile update, and messaging APIs"`

---

**✅ Day 4 Verification Checklist:**
- [ ] User search returns results excluding the current user
- [ ] Profile picture upload saves to `/uploads/` directory
- [ ] First message between two users creates a new Conversation document
- [ ] Subsequent messages reuse the existing Conversation
- [ ] Messages are retrieved in chronological order
- [ ] `lastMessage` field on Conversation is updated

---
---

## 📅 Day 5 — Socket.IO Real-Time Setup

**Goal:** Integrate Socket.IO into the backend, implement connection management, real-time message delivery, typing indicators, and online/offline status.

---

### TODO 5.1 — Integrate Socket.IO with Express Server *(30 min)*

- [ ] In `server/server.js`:
  1. Import `http` module and `Server` from `socket.io`
  2. Create HTTP server: `const httpServer = http.createServer(app)`
  3. Initialize Socket.IO:
     ```javascript
     const io = new Server(httpServer, {
       cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
     });
     ```
  4. Replace `app.listen()` with `httpServer.listen()`
  5. Pass `io` to the socket handler

### TODO 5.2 — Socket Handler (`server/sockets/socketHandler.js`) *(90 min)*

- [ ] Create a module that exports a function `initializeSocket(io)`:
- [ ] Create an in-memory Map: `const onlineUsers = new Map()`
- [ ] On `io.on('connection', (socket) => { ... })`:

  **Connection Setup:**
  - [ ] Extract `userId` from `socket.handshake.auth` or `socket.handshake.query`
  - [ ] Validate `userId` is present
  - [ ] Store mapping: `onlineUsers.set(userId, socket.id)`
  - [ ] Join user to their own room: `socket.join(userId)`
  - [ ] Update DB: `User.findByIdAndUpdate(userId, { isOnline: true })`
  - [ ] Broadcast to all: `io.emit('user_online', { userId })`
  - [ ] Send current online user list to the connecting user:
    ```javascript
    socket.emit('online_users', Array.from(onlineUsers.keys()))
    ```

  **`send_message` event:**
  - [ ] Listen for `socket.on('send_message', async (data) => { ... })`
  - [ ] Extract `receiverId`, `text`, `fileUrl`, `fileType` from `data`
  - [ ] Find or create conversation (same logic as REST controller)
  - [ ] Save message to DB
  - [ ] Update conversation's `lastMessage`
  - [ ] Emit `receive_message` to receiver: `io.to(receiverId).emit('receive_message', message)`
  - [ ] Emit `message_sent` to sender: `socket.emit('message_sent', message)`

  **`typing` event:**
  - [ ] Listen for `socket.on('typing', ({ receiverId }) => { ... })`
  - [ ] Emit to receiver: `io.to(receiverId).emit('user_typing', { userId })`

  **`stop_typing` event:**
  - [ ] Listen for `socket.on('stop_typing', ({ receiverId }) => { ... })`
  - [ ] Emit to receiver: `io.to(receiverId).emit('user_stop_typing', { userId })`

  **`mark_read` event:**
  - [ ] Listen for `socket.on('mark_read', async ({ conversationId }) => { ... })`
  - [ ] Update messages: `Message.updateMany({ conversationId, receiver: userId, isRead: false }, { isRead: true })`

  **Disconnect:**
  - [ ] On `socket.on('disconnect', () => { ... })`:
  - [ ] Remove from map: `onlineUsers.delete(userId)`
  - [ ] Update DB: `User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: Date.now() })`
  - [ ] Broadcast: `io.emit('user_offline', { userId, lastSeen: new Date() })`

### TODO 5.3 — Wire Socket Handler in server.js *(10 min)*

- [ ] Import `initializeSocket` from `./sockets/socketHandler`
- [ ] Call `initializeSocket(io)` after creating the Socket.IO instance
- [ ] Verify: Start server, check "Socket.IO initialized" log

### TODO 5.4 — Quick Socket Test *(30 min)*

- [ ] Create a temporary HTML file or use a Socket.IO test client to:
  - Connect to `http://localhost:5000` with auth `{ userId: '<valid_mongo_id>' }`
  - Verify `connected` event fires
  - Verify `online_users` event returns the list
  - Send a `send_message` event and verify `message_sent` comes back
  - Open a second client → verify `receive_message` fires on the receiver
  - Disconnect one client → verify `user_offline` fires
- [ ] Delete the test file after verification

### TODO 5.5 — Commit *(5 min)*

- [ ] `git commit -m "feat: implement Socket.IO real-time messaging and status"`

---

**✅ Day 5 Verification Checklist:**
- [ ] Socket.IO connection establishes successfully
- [ ] Online users map tracks connected users
- [ ] Messages sent via socket are saved to DB
- [ ] Receiver gets `receive_message` event in real-time
- [ ] Typing indicators work bidirectionally
- [ ] Disconnect triggers `user_offline` broadcast

---
---

## 📅 Day 6 — Frontend: API Service Layer & Context Providers

**Goal:** Build the Axios API service layer and all four React Context providers (Auth, Chat, Socket, Theme).

---

### TODO 6.1 — Axios Instance (`client/src/services/api.js`) *(20 min)*

- [ ] Create an Axios instance with:
  - `baseURL: import.meta.env.VITE_API_URL`
  - Default `Content-Type: application/json`
- [ ] Add a request interceptor:
  - Read token from `localStorage.getItem('token')`
  - If token exists, set `Authorization: Bearer ${token}`
- [ ] Add a response interceptor:
  - On 401 error → clear localStorage, redirect to `/login`
- [ ] Export the instance as default

### TODO 6.2 — API Service Files *(30 min)*

- [ ] **`authService.js`:**
  - `register(name, email, password)` → POST `/auth/register`
  - `login(email, password)` → POST `/auth/login`
  - `getMe()` → GET `/auth/me`

- [ ] **`userService.js`:**
  - `searchUsers(query)` → GET `/users/search?q=${query}`
  - `updateProfile(formData)` → PUT `/users/profile` with `Content-Type: multipart/form-data`

- [ ] **`messageService.js`:**
  - `getMessages(userId)` → GET `/messages/${userId}`
  - `sendMessage(data)` → POST `/messages/send`

### TODO 6.3 — AuthContext (`client/src/context/AuthContext.jsx`) *(60 min)*

- [ ] Create `AuthContext` with `createContext()`
- [ ] Create `AuthProvider` component with state:
  - `user` (object | null)
  - `token` (string | null — initialized from localStorage)
  - `isAuthenticated` (boolean)
  - `loading` (boolean — true while checking token on mount)
- [ ] Implement functions:
  - `register(name, email, password)`: Call API, save token to localStorage, set user state
  - `login(email, password)`: Call API, save token, set user state
  - `logout()`: Clear localStorage, reset state, disconnect socket
  - `checkAuth()`: On mount, if token exists, call `getMe()` to validate; if fails, logout
- [ ] Use `useEffect` to call `checkAuth()` on initial mount
- [ ] Export `useAuth()` custom hook: `useContext(AuthContext)`

### TODO 6.4 — ChatContext (`client/src/context/ChatContext.jsx`) *(60 min)*

- [ ] Create `ChatContext` with `createContext()`
- [ ] Create `ChatProvider` with state:
  - `conversations` (array)
  - `activeChat` (object | null — the selected user to chat with)
  - `messages` (array — messages for the active chat)
  - `unreadMap` (object — `{ [userId]: count }`)
  - `searchResults` (array)
- [ ] Implement functions:
  - `setActiveChat(user)`: Set active chat user, fetch messages via API
  - `fetchMessages(userId)`: Call `messageService.getMessages(userId)`, set messages state
  - `addMessage(message)`: Append to messages array (used by socket listener)
  - `searchUsers(query)`: Call `userService.searchUsers(query)`, set searchResults
  - `updateUnread(senderId)`: Increment unread count for senderId
  - `clearUnread(userId)`: Reset unread count for userId
- [ ] Export `useChat()` custom hook

### TODO 6.5 — SocketContext (`client/src/context/SocketContext.jsx`) *(45 min)*

- [ ] Create `SocketContext` with `createContext()`
- [ ] Create `SocketProvider` with state:
  - `socket` (Socket instance | null)
  - `onlineUsers` (array of userId strings)
  - `typingUsers` (object — `{ [userId]: boolean }`)
- [ ] On mount (when `user` is authenticated):
  - Connect to `import.meta.env.VITE_SOCKET_URL` with `auth: { userId: user._id }`
  - Listen for `online_users` → set onlineUsers
  - Listen for `user_online` → add to onlineUsers
  - Listen for `user_offline` → remove from onlineUsers
  - Listen for `receive_message` → call `chatContext.addMessage()`
  - Listen for `user_typing` → update typingUsers
  - Listen for `user_stop_typing` → update typingUsers
- [ ] On unmount or logout → `socket.disconnect()`
- [ ] Expose helper functions:
  - `sendMessage(data)` → `socket.emit('send_message', data)`
  - `emitTyping(receiverId)` → `socket.emit('typing', { receiverId })`
  - `emitStopTyping(receiverId)` → `socket.emit('stop_typing', { receiverId })`
- [ ] Export `useSocket()` custom hook

### TODO 6.6 — ThemeContext (`client/src/context/ThemeContext.jsx`) *(20 min)*

- [ ] Create `ThemeContext`
- [ ] State: `theme` — `'dark'` or `'light'` (default from localStorage or `'dark'`)
- [ ] `toggleTheme()` function: switch between dark/light, save to localStorage
- [ ] Apply theme: add/remove `'dark'` class on `document.documentElement`
- [ ] Export `useTheme()` custom hook

### TODO 6.7 — Wrap App with Providers (`client/src/App.jsx`) *(15 min)*

- [ ] Nest providers:
  ```jsx
  <ThemeProvider>
    <AuthProvider>
      <ChatProvider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </ChatProvider>
    </AuthProvider>
  </ThemeProvider>
  ```

### TODO 6.8 — Commit *(5 min)*

- [ ] `git commit -m "feat: add API services and all context providers"`

---

**✅ Day 6 Verification Checklist:**
- [ ] Axios instance correctly attaches JWT to requests
- [ ] All service functions export correctly
- [ ] AuthContext login/register functions work (test with console.log)
- [ ] ThemeContext toggles dark class on HTML element
- [ ] App renders without errors with all providers wrapped

---
---

## 📅 Day 7 — Frontend: Routing & Authentication Pages

**Goal:** Build the login and registration pages with full form validation, error handling, beautiful UI, and connect them to the AuthContext.

---

### TODO 7.1 — Route Configuration (`client/src/App.jsx`) *(30 min)*

- [ ] Import `createBrowserRouter`, `RouterProvider` from `react-router-dom`
- [ ] Define routes:
  ```jsx
  const router = createBrowserRouter([
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    {
      path: '/',
      element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
      children: [
        { index: true, element: <ChatDashboard /> },
        { path: 'profile', element: <ProfilePage /> },
      ]
    },
    { path: '*', element: <NotFoundPage /> }
  ]);
  ```
- [ ] Create `ProtectedRoute` component:
  - Check `isAuthenticated` from `useAuth()`
  - If not authenticated → `<Navigate to="/login" />`
  - If loading → show spinner
  - If authenticated → render `<Outlet />` or `children`

### TODO 7.2 — Login Page (`client/src/pages/LoginPage.jsx`) *(90 min)*

- [ ] Design a centered card layout with:
  - App logo / title at the top
  - Email input field with icon (Mail icon from Lucide)
  - Password input field with icon (Lock icon) and show/hide toggle (Eye/EyeOff)
  - "Remember me" checkbox (optional)
  - Submit button with loading spinner state
  - Link to register page: "Don't have an account? Sign up"
- [ ] Form state management with `useState`:
  - `email`, `password`, `showPassword`, `loading`, `error`
- [ ] On submit:
  - Validate fields are not empty
  - Call `auth.login(email, password)` from `useAuth()`
  - On success → navigate to `/`
  - On error → display error message (use `react-hot-toast` for notifications)
- [ ] Style with Tailwind CSS:
  - Full-height centered layout
  - Glassmorphism card with backdrop blur
  - Gradient background
  - Smooth focus transitions on inputs
  - Hover effects on buttons
  - Dark mode support

### TODO 7.3 — Register Page (`client/src/pages/RegisterPage.jsx`) *(90 min)*

- [ ] Design similar to Login but with additional fields:
  - Full Name input (User icon)
  - Email input (Mail icon)
  - Password input with show/hide toggle
  - Confirm Password input
  - Submit button
  - Link to login page: "Already have an account? Log in"
- [ ] Form validation:
  - Name: required, minimum 2 characters
  - Email: required, valid email format (regex)
  - Password: required, minimum 6 characters
  - Confirm password: must match password
- [ ] Display inline validation errors below each field
- [ ] On submit:
  - Call `auth.register(name, email, password)` from `useAuth()`
  - On success → navigate to `/`
  - On error → show toast notification
- [ ] Style consistently with Login page

### TODO 7.4 — Common UI Components *(30 min)*

- [ ] **`components/common/LoadingSpinner.jsx`:**
  - Animated CSS spinner component
  - Accept `size` prop (sm, md, lg)

- [ ] **`components/common/InputField.jsx`:**
  - Reusable input with label, icon, error message
  - Props: `label`, `type`, `value`, `onChange`, `icon`, `error`, `placeholder`
  - Styled consistently with the auth pages

### TODO 7.5 — Tailwind Base Styles & Design Tokens (`client/src/index.css`) *(30 min)*

- [ ] Define CSS custom properties (variables) for the design system:
  ```css
  :root {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-card: rgba(30, 41, 59, 0.8);
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --accent: #6366f1;
    --accent-hover: #818cf8;
    --danger: #ef4444;
    --success: #22c55e;
    --border: rgba(148, 163, 184, 0.1);
  }
  ```
- [ ] Add base styles for body, scrollbar, focus rings
- [ ] Add utility classes for glassmorphism cards, gradient backgrounds
- [ ] Import Google Font: Inter or similar modern font

### TODO 7.6 — Test Auth Flow *(20 min)*

- [ ] Navigate to `/login` → verify the page renders correctly
- [ ] Submit empty form → verify validation errors appear
- [ ] Register a new user → verify redirect to chat dashboard
- [ ] Logout → verify redirect to login
- [ ] Login with the registered user → verify success
- [ ] Navigate to `/` without token → verify redirect to login

### TODO 7.7 — Commit *(5 min)*

- [ ] `git commit -m "feat: implement routing, login, and register pages"`

---

**✅ Day 7 Verification Checklist:**
- [ ] Login and Register pages render with beautiful UI
- [ ] Form validation works (client-side)
- [ ] Successful register → token saved, redirect to /
- [ ] Successful login → token saved, redirect to /
- [ ] Protected routes redirect unauthenticated users
- [ ] Dark/Light mode applies to auth pages

---
---

## 📅 Day 8 — Frontend: Main Layout & Sidebar

**Goal:** Build the main chat dashboard layout with the sidebar containing user search, conversation list, and navigation.

---

### TODO 8.1 — Main Layout (`client/src/pages/MainLayout.jsx`) *(30 min)*

- [ ] Create a two-panel layout:
  - Left panel: Sidebar (fixed width ~320px on desktop, full-width on mobile)
  - Right panel: `<Outlet />` for chat area or profile page
- [ ] Add responsive behavior:
  - On mobile (< 768px): Show sidebar by default; when a chat is selected, show chat area with a back button
  - On desktop: Show both side by side
- [ ] Use `useState` for `showSidebar` toggle on mobile

### TODO 8.2 — Sidebar Component (`client/src/components/sidebar/Sidebar.jsx`) *(45 min)*

- [ ] Structure:
  ```
  ┌──────────────────────┐
  │  App Header          │ ← Logo, app name, theme toggle, logout
  │  (user avatar + name)│
  ├──────────────────────┤
  │  Search Bar          │ ← Input to search users
  ├──────────────────────┤
  │  Conversation List   │ ← List of recent chats
  │  ┌──────────────────┐│
  │  │ ConvoItem 1      ││
  │  │ ConvoItem 2      ││
  │  │ ...              ││
  │  └──────────────────┘│
  └──────────────────────┘
  ```
- [ ] Header section:
  - Current user's avatar (or initials fallback)
  - User's name
  - Theme toggle button (Sun/Moon icon)
  - Settings/Profile link
  - Logout button
- [ ] Use `useAuth()`, `useChat()`, `useTheme()` hooks

### TODO 8.3 — Search Bar (`client/src/components/sidebar/SearchBar.jsx`) *(30 min)*

- [ ] Input field with search icon
- [ ] On input change → debounce 300ms → call `chatContext.searchUsers(query)`
- [ ] When query is empty → show conversation list
- [ ] When query has results → show search results overlay (list of users to start new chat)
- [ ] On clicking a search result:
  - Call `chatContext.setActiveChat(selectedUser)`
  - Clear search query
  - On mobile → hide sidebar

### TODO 8.4 — Conversation List (`client/src/components/sidebar/ConversationList.jsx`) *(30 min)*

- [ ] Fetch and display list of user's conversations
- [ ] Each item shows:
  - User avatar
  - User name
  - Last message preview (truncated to ~40 chars)
  - Timestamp of last message (formatted: "2m ago", "Yesterday", etc.)
  - Unread badge (if any)
  - Online indicator (green dot)
- [ ] Sort conversations by most recent message first
- [ ] Highlight the active/selected conversation

### TODO 8.5 — Conversation Item (`client/src/components/sidebar/ConversationItem.jsx`) *(30 min)*

- [ ] Accept props: `user`, `lastMessage`, `unreadCount`, `isOnline`, `isActive`, `onClick`
- [ ] Layout:
  ```
  ┌───────────────────────────────┐
  │ [Avatar]  Name        2m ago  │
  │           Last message...  (3)│
  │ 🟢                            │
  └───────────────────────────────┘
  ```
- [ ] Avatar: Show profile pic or initials in a colored circle
- [ ] Online indicator: Small green dot on avatar border
- [ ] Unread badge: Small red circle with count
- [ ] Hover effect: Subtle background change
- [ ] Active state: Highlighted background

### TODO 8.6 — Utility: Time Formatter (`client/src/utils/formatTime.js`) *(20 min)*

- [ ] Export `formatMessageTime(dateString)`:
  - Less than 1 minute → "Just now"
  - Less than 1 hour → "Xm ago"
  - Less than 24 hours → "Xh ago"
  - Less than 7 days → "Monday", "Tuesday", etc.
  - Otherwise → "MM/DD/YYYY"
- [ ] Export `formatChatTimestamp(dateString)`:
  - Returns "HH:MM AM/PM" for today
  - Returns "Yesterday HH:MM" for yesterday
  - Returns "MM/DD HH:MM" for older

### TODO 8.7 — Avatar Component (`client/src/components/common/Avatar.jsx`) *(20 min)*

- [ ] Accept props: `src`, `name`, `size` (sm, md, lg), `isOnline`
- [ ] If `src` exists → show image in circular container
- [ ] If no `src` → show initials with a deterministic background color based on the name
- [ ] Online indicator: Absolute positioned green dot
- [ ] Smooth image loading with placeholder

### TODO 8.8 — Test Sidebar *(15 min)*

- [ ] Verify sidebar renders with current user info
- [ ] Search for a user → verify results appear
- [ ] Click a search result → verify `activeChat` is set
- [ ] Verify responsive behavior on mobile viewports

### TODO 8.9 — Commit *(5 min)*

- [ ] `git commit -m "feat: implement main layout and sidebar with search"`

---

**✅ Day 8 Verification Checklist:**
- [ ] Sidebar renders with user info and theme toggle
- [ ] Search works with debounced API calls
- [ ] Conversation list shows recent chats
- [ ] Active chat is highlighted
- [ ] Responsive layout works (mobile sidebar toggle)
- [ ] Avatar component handles both images and initials

---
---

## 📅 Day 9 — Frontend: Chat Area & Message Display

**Goal:** Build the complete chat interface — chat header, message list with bubbles, and the message input bar.

---

### TODO 9.1 — Chat Area Container (`client/src/components/chat/ChatArea.jsx`) *(20 min)*

- [ ] If no `activeChat` is selected → show an empty state:
  - Large message/chat icon
  - Text: "Select a conversation to start chatting"
  - Subtle animation
- [ ] If `activeChat` is set → render:
  - `<ChatHeader />`
  - `<MessageList />`
  - `<MessageInput />`
- [ ] Full height layout with flex column

### TODO 9.2 — Chat Header (`client/src/components/chat/ChatHeader.jsx`) *(30 min)*

- [ ] Display:
  - Back arrow (mobile only) → clears active chat, shows sidebar
  - Avatar of the active chat user
  - User name
  - Online status: "Online" (green text) or "Last seen X ago" (gray text)
  - Typing indicator: "typing..." (animated dots)
- [ ] Use `useSocket()` to check:
  - `onlineUsers.includes(activeChat._id)` for online status
  - `typingUsers[activeChat._id]` for typing indicator

### TODO 9.3 — Message List (`client/src/components/chat/MessageList.jsx`) *(60 min)*

- [ ] Fetch messages when `activeChat` changes:
  ```javascript
  useEffect(() => {
    if (activeChat) chatContext.fetchMessages(activeChat._id);
  }, [activeChat]);
  ```
- [ ] Render messages as a scrollable list
- [ ] Auto-scroll to bottom:
  - Use `useRef` for the container
  - Call `messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })` when messages update
- [ ] Group messages by date (insert date separator: "Today", "Yesterday", "July 15, 2026")
- [ ] For each message → render `<MessageBubble />`
- [ ] Show loading spinner while fetching
- [ ] Empty state: "No messages yet. Say hello! 👋"

### TODO 9.4 — Message Bubble (`client/src/components/chat/MessageBubble.jsx`) *(45 min)*

- [ ] Accept props: `message`, `isSender`
- [ ] Layout:
  - Sender messages: Aligned right, accent color background
  - Receiver messages: Aligned left, darker background
- [ ] Display:
  - Message text (if present)
  - File preview (if `fileUrl` exists):
    - Image: Show inline thumbnail (clickable to view full)
    - Video: Show video player
    - Document: Show file icon with filename
  - Timestamp (bottom-right corner, smaller font)
  - Read status for sender: Single check (sent) / Double check (read) — optional
- [ ] Styling:
  - Rounded corners (more rounded on the sender's side)
  - Max-width ~70% of container
  - Subtle shadow
  - Smooth entry animation (slide up + fade in)

### TODO 9.5 — Date Separator (`client/src/components/chat/DateSeparator.jsx`) *(15 min)*

- [ ] Accept prop: `date`
- [ ] Render: A horizontal line with the date text centered
- [ ] Example: `——— Today ———`
- [ ] Style: Muted text, small font

### TODO 9.6 — Test Chat Display *(20 min)*

- [ ] Select a user from sidebar → verify messages load
- [ ] Send a test message via Postman → verify it appears in the list
- [ ] Verify auto-scroll works when new messages arrive
- [ ] Verify date separators appear correctly
- [ ] Verify sender/receiver bubble alignment

### TODO 9.7 — Commit *(5 min)*

- [ ] `git commit -m "feat: implement chat area with message list and bubbles"`

---

**✅ Day 9 Verification Checklist:**
- [ ] Empty state shows when no chat is selected
- [ ] Messages load when selecting a conversation
- [ ] Sender messages align right with accent color
- [ ] Receiver messages align left with darker color
- [ ] Auto-scroll works on new messages
- [ ] Date separators group messages by day
- [ ] Timestamps display correctly on each bubble

---
---

## 📅 Day 10 — Frontend: Message Input, Sending & Real-Time Reception

**Goal:** Build the message input component with emoji picker, file attachment, and wire up real-time message sending/receiving through Socket.IO.

---

### TODO 10.1 — Message Input (`client/src/components/chat/MessageInput.jsx`) *(60 min)*

- [ ] Layout (bottom bar):
  ```
  ┌──────────────────────────────────────────┐
  │ [📎] [😊]  Type a message...      [Send] │
  └──────────────────────────────────────────┘
  ```
- [ ] State: `text`, `showEmojiPicker`, `selectedFile`, `filePreview`, `sending`
- [ ] Text input:
  - Multi-line capable (textarea with auto-resize, max 4 lines)
  - Enter to send (Shift+Enter for new line)
  - Placeholder: "Type a message..."
- [ ] Attachment button (Paperclip icon):
  - Opens hidden file input
  - On file select → validate size (≤ 5MB) and type
  - Show file preview bar above the input area
  - Preview bar: Filename, file icon, remove button (X)
- [ ] Emoji picker toggle button (Smile icon):
  - Opens `emoji-picker-react` component above the input
  - On emoji select → append to text
  - Click outside → close picker
- [ ] Send button (SendHorizontal icon):
  - Disabled when both text and file are empty
  - On click → call send function
  - Show loading state while sending

### TODO 10.2 — Send Message Logic *(30 min)*

- [ ] On send:
  1. If file is selected:
     - Create `FormData` with file
     - Upload via `messageService.sendMessage()` (or a separate upload endpoint)
     - Get back `fileUrl`
  2. Emit socket event:
     ```javascript
     socket.emit('send_message', {
       receiverId: activeChat._id,
       text: text.trim(),
       fileUrl: fileUrl || '',
       fileType: fileType || ''
     });
     ```
  3. Clear input fields after sending
  4. Auto-focus back on text input

### TODO 10.3 — Typing Indicator Emission *(20 min)*

- [ ] On text input change:
  - If not already typing → emit `socket.emit('typing', { receiverId: activeChat._id })`
  - Set a timeout (2 seconds)
  - If no further input after timeout → emit `socket.emit('stop_typing', { receiverId })`
- [ ] Implement using `useRef` for the timeout ID to properly clear and reset

### TODO 10.4 — Real-Time Message Reception (SocketContext Integration) *(30 min)*

- [ ] In `SocketContext`, when `receive_message` event fires:
  - If the message is from the `activeChat` user → add to messages array
  - If the message is from another user → increment unread count in `unreadMap`
  - Play notification sound (optional — use a short audio file)
  - Show toast notification if the message is from a non-active chat
- [ ] In `SocketContext`, when `message_sent` event fires:
  - Add the confirmed message to the messages array (replace optimistic update if used)

### TODO 10.5 — File Preview Component (`client/src/components/chat/FilePreview.jsx`) *(20 min)*

- [ ] Accept props: `file`, `onRemove`
- [ ] Show:
  - Image files: Thumbnail preview
  - Video files: Video icon + filename
  - Documents: Document icon + filename
- [ ] Remove button (X) to deselect the file

### TODO 10.6 — Test Full Messaging Flow *(30 min)*

- [ ] Open two browser tabs with different user accounts
- [ ] User A sends text message to User B → verify:
  - Message appears in User A's chat immediately
  - Message appears in User B's chat in real-time
- [ ] User B replies → verify same behavior
- [ ] Test emoji insertion → verify emoji renders in bubble
- [ ] Test file upload → verify file preview appears, message sends with attachment
- [ ] Test typing indicator:
  - User A starts typing → User B sees "typing..." in chat header
  - User A stops typing → "typing..." disappears after ~2 seconds

### TODO 10.7 — Commit *(5 min)*

- [ ] `git commit -m "feat: implement message input, sending, and real-time reception"`

---

**✅ Day 10 Verification Checklist:**
- [ ] Text messages send and receive in real-time
- [ ] Emoji picker works and emojis display in messages
- [ ] File attachment uploads and previews correctly
- [ ] Enter key sends, Shift+Enter creates new line
- [ ] Typing indicator shows/hides correctly
- [ ] Unread count increments for non-active chats
- [ ] Send button is disabled when input is empty

---
---

## 📅 Day 11 — Online/Offline Status, Unread Badges & Notifications

**Goal:** Polish the real-time experience with live online/offline indicators, unread message badges, and toast notifications.

---

### TODO 11.1 — Online Status Indicators *(30 min)*

- [ ] In `ConversationItem`:
  - Check if the user is in `onlineUsers` array from `useSocket()`
  - Show green dot on avatar if online
  - Show "Online" or "Last seen X ago" below the name
- [ ] In `ChatHeader`:
  - Display "Online" (pulsating green dot) or "Last seen 2 hours ago"
- [ ] Test: Login with User A, verify User B's sidebar shows "Online" for User A

### TODO 11.2 — Unread Message Badges *(45 min)*

- [ ] In `ChatContext`, maintain `unreadMap` state:
  ```javascript
  const [unreadMap, setUnreadMap] = useState({});
  // { 'user123': 3, 'user456': 1 }
  ```
- [ ] When `receive_message` fires (and sender is NOT the active chat):
  - Increment: `setUnreadMap(prev => ({ ...prev, [senderId]: (prev[senderId] || 0) + 1 }))`
- [ ] When user opens a chat (sets active chat):
  - Clear unread: `setUnreadMap(prev => ({ ...prev, [userId]: 0 }))`
  - Emit `mark_read` socket event
- [ ] In `ConversationItem`:
  - Display unread badge (red circle with count) if `unreadMap[userId] > 0`
  - Badge should have a pop-in animation when count increases

### TODO 11.3 — Toast Notifications *(20 min)*

- [ ] Using `react-hot-toast`:
  - On receiving a message from a non-active user → show toast:
    ```
    "💬 {senderName}: {messagePreview}"
    ```
  - Toast duration: 4 seconds
  - Toast position: top-right
  - On toast click → switch to that conversation
- [ ] Configure `<Toaster />` in `App.jsx`:
  ```jsx
  <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
  ```

### TODO 11.4 — Notification Sound *(20 min)*

- [ ] Add a short notification sound file (`notification.mp3`) to `client/src/assets/`
- [ ] Create a utility function `playNotificationSound()`:
  ```javascript
  const audio = new Audio('/notification.mp3');
  audio.volume = 0.5;
  audio.play();
  ```
- [ ] Call this function when a message is received from a non-active chat
- [ ] Respect browser autoplay policies (wrap in try/catch)

### TODO 11.5 — Sidebar Conversation Sorting *(20 min)*

- [ ] When a new message arrives (sent or received):
  - Move that conversation to the top of the list
  - Update the last message preview text
  - Update the timestamp
- [ ] Sort conversations by `lastMessage.createdAt` descending

### TODO 11.6 — Test Notifications & Badges *(20 min)*

- [ ] Open two tabs — User A chatting with User C, User B sends message to User A
  - Verify: Toast notification appears for User A
  - Verify: Unread badge appears on User B's conversation item
  - Verify: Notification sound plays
- [ ] User A clicks on User B's conversation
  - Verify: Unread badge clears
  - Verify: Messages show as read

### TODO 11.7 — Commit *(5 min)*

- [ ] `git commit -m "feat: add online status, unread badges, and notifications"`

---

**✅ Day 11 Verification Checklist:**
- [ ] Green dot shows for online users in sidebar
- [ ] Chat header shows online/offline status accurately
- [ ] Unread badges appear with correct count
- [ ] Badges clear when conversation is opened
- [ ] Toast notifications show for messages from other chats
- [ ] Notification sound plays
- [ ] Conversations reorder by most recent message

---
---

## 📅 Day 12 — Profile Page & File Upload

**Goal:** Build the user profile management page and finalize the file/image upload functionality for both profile pictures and chat attachments.

---

### TODO 12.1 — Profile Page (`client/src/pages/ProfilePage.jsx`) *(90 min)*

- [ ] Layout (centered card):
  ```
  ┌─────────────────────────────┐
  │      [Large Avatar]         │
  │    [Change Photo Button]    │
  │                             │
  │  Name:   [______________]   │
  │  Email:  user@email.com     │  (read-only)
  │  Status: [______________]   │
  │                             │
  │  [Save Changes]  [Cancel]   │
  └─────────────────────────────┘
  ```
- [ ] Avatar section:
  - Large circular avatar (120px)
  - "Change Photo" button overlaid on hover
  - Opens file input for image selection
  - Shows image preview before upload
- [ ] Form fields:
  - Name: Editable text input, pre-filled with current name
  - Email: Read-only, displayed as text
  - Status: Editable textarea (max 140 characters), character count display
- [ ] Action buttons:
  - "Save Changes": Calls `userService.updateProfile(formData)`, shows loading state
  - "Cancel": Resets form to original values
- [ ] On successful save → update `user` in `AuthContext`, show success toast

### TODO 12.2 — Profile Picture Upload Flow *(30 min)*

- [ ] On file selection:
  1. Validate: Only image files (JPEG, PNG, GIF, WebP)
  2. Validate: Size ≤ 5 MB
  3. Show preview using `URL.createObjectURL(file)`
  4. Store the file in state (don't upload yet)
- [ ] On "Save Changes":
  1. Create `FormData` object
  2. Append `name`, `status`, and `profilePic` (file) if changed
  3. Call `updateProfile(formData)` with `Content-Type: multipart/form-data`
  4. Update user in AuthContext with the returned user object

### TODO 12.3 — Chat File Upload Enhancement *(30 min)*

- [ ] In `MessageInput`, enhance the file upload:
  - When user selects a file, show a preview bar above the input:
    - Image: Inline thumbnail (max-height 100px)
    - Video: Video icon with filename and size
    - Document: Document icon with filename and size
  - "Remove" button (X) to deselect
- [ ] On send with file:
  1. First upload the file via a separate API call or include in the message send
  2. Show upload progress indicator (optional: use Axios `onUploadProgress`)
  3. After upload completes, send the message with `fileUrl`

### TODO 12.4 — Image Viewer Modal (`client/src/components/common/ImageModal.jsx`) *(30 min)*

- [ ] Accept props: `src`, `isOpen`, `onClose`
- [ ] Full-screen overlay with blurred background
- [ ] Centered image with max-width/max-height constraints
- [ ] Close button (X) in top-right corner
- [ ] Click outside image to close
- [ ] Keyboard: Escape key to close
- [ ] Smooth open/close animation

### TODO 12.5 — Static File Serving Verification *(15 min)*

- [ ] Verify `server.js` serves uploaded files:
  ```javascript
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  ```
- [ ] Upload a profile picture → verify the URL works: `http://localhost:5000/uploads/filename.jpg`
- [ ] Upload a file in chat → verify it's accessible via URL

### TODO 12.6 — Test Profile & Upload *(20 min)*

- [ ] Navigate to `/profile` → verify current user info is pre-filled
- [ ] Change name → save → verify name updates in sidebar and profile
- [ ] Change profile picture → verify preview shows → save → verify avatar updates everywhere
- [ ] Change status → verify character count → save → verify update
- [ ] Send an image in chat → verify thumbnail displays in message bubble
- [ ] Click image in bubble → verify full-size modal opens

### TODO 12.7 — Commit *(5 min)*

- [ ] `git commit -m "feat: implement profile page and file upload system"`

---

**✅ Day 12 Verification Checklist:**
- [ ] Profile page renders with pre-filled data
- [ ] Profile picture upload works with preview
- [ ] Name and status update correctly
- [ ] File attachments in chat display properly
- [ ] Image modal opens/closes smoothly
- [ ] Uploaded files are accessible via static URL

---
---

## 📅 Day 13 — UI Polish, Dark/Light Mode & Responsive Design

**Goal:** Apply final visual polish, implement complete dark/light mode theming, ensure full responsiveness, add micro-animations, and fix any visual bugs.

---

### TODO 13.1 — Dark/Light Theme Implementation *(60 min)*

- [ ] Define dark mode colors in CSS variables:
  ```css
  :root {
    /* Light mode */
    --bg-primary: #f8fafc;
    --bg-secondary: #e2e8f0;
    --bg-card: rgba(255, 255, 255, 0.9);
    --text-primary: #0f172a;
    --text-secondary: #475569;
    /* ... */
  }
  .dark {
    /* Dark mode */
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-card: rgba(30, 41, 59, 0.8);
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    /* ... */
  }
  ```
- [ ] Ensure ALL components use CSS variables (not hardcoded colors)
- [ ] Theme toggle button in sidebar header (Sun icon ↔ Moon icon)
- [ ] Smooth transition when switching themes:
  ```css
  * { transition: background-color 0.3s ease, color 0.3s ease; }
  ```
- [ ] Test: Toggle theme → verify all components switch correctly
- [ ] Test: Refresh page → verify theme persists from localStorage

### TODO 13.2 — Responsive Design Audit *(45 min)*

- [ ] **Mobile (< 640px):**
  - [ ] Sidebar takes full width
  - [ ] Chat area takes full width (with back button to sidebar)
  - [ ] Message input stays at the bottom
  - [ ] Emoji picker fits within viewport
  - [ ] Profile page card is full-width with padding
  - [ ] Login/Register pages scale down gracefully

- [ ] **Tablet (640px - 1024px):**
  - [ ] Sidebar width: 280px
  - [ ] Chat area fills remaining space
  - [ ] Message bubbles have appropriate max-width

- [ ] **Desktop (> 1024px):**
  - [ ] Sidebar width: 320px
  - [ ] Chat area has comfortable max-width
  - [ ] All elements well-spaced

- [ ] Test using Chrome DevTools device emulation for:
  - iPhone SE, iPhone 14, iPad, Desktop

### TODO 13.3 — Micro-Animations *(45 min)*

- [ ] **Page transitions:**
  - Login/Register → fade in
  - Chat selection → slide transition

- [ ] **Message bubbles:**
  - New messages slide up + fade in (from bottom)
  - Staggered entry animation for initial message load
  ```css
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  ```

- [ ] **Sidebar items:**
  - Hover → subtle background shift + slight scale
  - Active state → left border accent indicator

- [ ] **Buttons:**
  - Hover → slight scale up (1.02)
  - Click → scale down briefly (0.98) — active state
  - Loading state → spinner animation

- [ ] **Online status dot:**
  - Pulsating animation for online users
  ```css
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  ```

- [ ] **Typing indicator:**
  - Three bouncing dots animation
  ```css
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }
  ```

- [ ] **Unread badge:**
  - Pop-in animation when count increases
  ```css
  @keyframes popIn {
    0% { transform: scale(0); }
    80% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  ```

### TODO 13.4 — Empty States & Edge Cases *(30 min)*

- [ ] No conversations yet → "Start a new conversation by searching for users"
- [ ] No messages in conversation → "No messages yet. Say hello! 👋"
- [ ] No search results → "No users found. Try a different search."
- [ ] User goes offline → Update status with smooth transition
- [ ] Long messages → Proper text wrapping, no overflow
- [ ] Long names → Text truncation with ellipsis
- [ ] Network error → Toast notification with retry option

### TODO 13.5 — Scrollbar Styling *(15 min)*

- [ ] Custom scrollbar for message list and sidebar:
  ```css
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--text-secondary); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-primary); }
  ```

### TODO 13.6 — Final Visual Review *(20 min)*

- [ ] Review every page and component for visual consistency
- [ ] Check font sizes, spacing, and alignment
- [ ] Verify color consistency between light and dark modes
- [ ] Fix any visual glitches or inconsistencies

### TODO 13.7 — Commit *(5 min)*

- [ ] `git commit -m "feat: polish UI with themes, responsive design, and animations"`

---

**✅ Day 13 Verification Checklist:**
- [ ] Dark/Light mode toggle works everywhere
- [ ] Theme persists across page refreshes
- [ ] Responsive layout works on mobile, tablet, desktop
- [ ] All animations are smooth (no jank)
- [ ] Empty states display correctly
- [ ] Custom scrollbars styled
- [ ] No visual inconsistencies

---
---

## 📅 Day 14 — Testing, Bug Fixes, Deployment & Documentation

**Goal:** Final day — comprehensive testing, fix remaining bugs, deploy the application, and finalize documentation.

---

### TODO 14.1 — End-to-End Testing *(60 min)*

- [ ] **Authentication Flow:**
  - [ ] Register a new user → verify redirect to chat dashboard
  - [ ] Logout → verify redirect to login
  - [ ] Login with the registered user → verify success
  - [ ] Try accessing `/` without auth → verify redirect to `/login`
  - [ ] Try registering with duplicate email → verify error message
  - [ ] Try login with wrong password → verify error message

- [ ] **Messaging Flow (use two different browsers or incognito):**
  - [ ] User A sends text message → User B receives it in real-time
  - [ ] User B replies → User A receives it
  - [ ] Send multiple rapid messages → all arrive in order
  - [ ] Send a message with emoji → renders correctly
  - [ ] Send an image → displays in chat bubble
  - [ ] Send a document → shows download link
  - [ ] Typing indicator shows and hides correctly

- [ ] **Status & Notifications:**
  - [ ] User A logs in → User B sees "Online" indicator
  - [ ] User A logs out → User B sees "Last seen" with correct time
  - [ ] User A receives message while chatting with User C → unread badge appears for sender
  - [ ] Toast notification appears for messages from non-active chats
  - [ ] Clicking on conversation clears unread badge

- [ ] **Profile:**
  - [ ] Update name → reflected everywhere
  - [ ] Update status → reflected in user info
  - [ ] Upload profile picture → displayed correctly
  - [ ] Cancel changes → form resets

### TODO 14.2 — Bug Fix Sprint *(60 min)*

- [ ] Go through all discovered issues from E2E testing
- [ ] Fix each bug and verify the fix
- [ ] Common issues to watch for:
  - [ ] Socket disconnects not handled gracefully
  - [ ] Messages not appearing until refresh
  - [ ] Memory leaks from uncleared event listeners or intervals
  - [ ] Race conditions when switching chats rapidly
  - [ ] File upload failures not showing error messages
  - [ ] Edge case: Sending message to user who just went offline

### TODO 14.3 — Code Cleanup *(30 min)*

- [ ] Remove all `console.log` debug statements
- [ ] Remove unused imports and variables
- [ ] Add JSDoc comments to all utility functions
- [ ] Add comments to complex logic blocks
- [ ] Verify all `.env.example` files are present (without actual secrets)
- [ ] Ensure `uploads/` directory has a `.gitkeep` file

### TODO 14.4 — Deployment Preparation *(45 min)*

- [ ] **Backend deployment (Render / Railway):**
  - [ ] Create a free account on Render (render.com) or Railway
  - [ ] Create a new "Web Service" connected to the GitHub repo
  - [ ] Set root directory to `server/`
  - [ ] Set build command: `npm install`
  - [ ] Set start command: `npm start`
  - [ ] Add environment variables:
    - `PORT` (auto-assigned by host)
    - `MONGO_URI` (MongoDB Atlas connection string)
    - `JWT_SECRET` (strong random string)
    - `CLIENT_URL` (deployed frontend URL)
    - `NODE_ENV=production`
  - [ ] Deploy and verify the API is accessible

- [ ] **Frontend deployment (Vercel / Netlify):**
  - [ ] Create a free account on Vercel (vercel.com)
  - [ ] Import the GitHub repo
  - [ ] Set root directory to `client/`
  - [ ] Set build command: `npm run build`
  - [ ] Set output directory: `dist`
  - [ ] Add environment variables:
    - `VITE_API_URL` (deployed backend URL + `/api`)
    - `VITE_SOCKET_URL` (deployed backend URL)
  - [ ] Deploy and verify the frontend loads

- [ ] **MongoDB Atlas setup (if not already done):**
  - [ ] Create a free M0 cluster on MongoDB Atlas
  - [ ] Create a database user
  - [ ] Whitelist IPs (0.0.0.0/0 for development)
  - [ ] Get the connection string

### TODO 14.5 — Post-Deployment Testing *(30 min)*

- [ ] Test the deployed application:
  - [ ] Register a new user
  - [ ] Login
  - [ ] Search for users
  - [ ] Send and receive messages in real-time
  - [ ] Upload profile picture
  - [ ] Verify Socket.IO WebSocket connection (check browser dev tools)
  - [ ] Verify CORS is configured correctly (no errors in console)
  - [ ] Test on mobile device

### TODO 14.6 — Update Documentation *(30 min)*

- [ ] Update `README.md`:
  - [ ] Add live demo link
  - [ ] Add screenshots of the application (login, chat, profile, dark mode)
  - [ ] Update installation instructions if any changes were made
  - [ ] Add deployment instructions section
  - [ ] Add "Contributors" section
- [ ] Create `CONTRIBUTING.md` (optional)
- [ ] Ensure `.env.example` files are committed (without secrets)

### TODO 14.7 — Final Commit & Release *(10 min)*

- [ ] `git add . && git commit -m "chore: final polish, bug fixes, and deployment"`
- [ ] `git push origin main`
- [ ] Create a GitHub release tag: `v1.0.0`
- [ ] Verify the deployed app is working correctly

---

**✅ Day 14 Verification Checklist:**
- [ ] All E2E test cases pass
- [ ] All bugs from testing are fixed
- [ ] Code is clean — no debug logs or unused code
- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] MongoDB Atlas is configured and connected
- [ ] WebSocket connections work in production
- [ ] README is updated with screenshots and live demo link
- [ ] GitHub release tag created

---
---

## 📊 Summary Timeline

| Day | Focus Area | Key Deliverable |
|---|---|---|
| **1** | Project Setup | Monorepo with frontend + backend initialized |
| **2** | Database Models | User, Conversation, Message schemas + utils |
| **3** | Auth Backend | Register, Login, JWT middleware |
| **4** | User & Message APIs | Search, Profile, Send/Get messages |
| **5** | Socket.IO | Real-time messaging, typing, status |
| **6** | Frontend Services | Axios, Contexts (Auth, Chat, Socket, Theme) |
| **7** | Auth Pages | Login, Register with beautiful UI |
| **8** | Sidebar | Layout, search, conversation list |
| **9** | Chat Display | Message list, bubbles, date separators |
| **10** | Message Input | Sending, emoji, file attach, real-time |
| **11** | Notifications | Online status, unread badges, toasts |
| **12** | Profile & Upload | Profile page, file/image upload |
| **13** | UI Polish | Themes, responsive, animations |
| **14** | Testing & Deploy | E2E testing, deployment, documentation |

---

> **🎯 At the end of Day 14, you will have a fully functional, beautifully designed, deployed real-time chat application.**
