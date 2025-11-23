📝 JourneySoul – Blog Application

A full-featured MERN blog platform where users can create, edit, and share blog posts, while admins manage users, content, and platform settings.

🌐 Live Website: https://journey-soul-frontend.vercel.app/

🖥️ Frontend GitHub: https://github.com/habibulla552272/JourneySoul-frontend

🗄️ Server API: https://journeysoul-server.onrender.com

⚙️ Backend GitHub: https://github.com/rashed-mahmud2/Journeysoul-server

👥 Team Project – JourneySoul Developers

This project was collaboratively developed by a two-member team, focusing on building a full-stack MERN blog application with modern features, clean architecture, and secure authentication.

Team Members
1. Habibulla Islam Habib <br/>
Role: Frontend Developer<br/>
Email: mdhabibullah146425@gmail.com<br/>
GitHub: https://github.com/habibulla552272

2. Rashed Mahmud <br/>
Role: Backend Developer<br/>
Email: mahamud2071@gmail.com<br/>
GitHub: https://github.com/rashed-mahmud2
```markdown
# 🛠️ JourneySoul Server API Documentation

**Base URL:**
```

---

[https://journeysoul-server.onrender.com](https://journeysoul-server.onrender.com)

---

## 🌍 Welcome to JourneySoul Server

JourneySoul Server powers your blogging platform — handling users, blogs, likes, and comments efficiently through RESTful APIs.

---

## 🧑‍💻 Authentication

Most routes require authentication using **JWT Tokens**.

Include your token in headers:

```

Authorization: Bearer <your_token_here>
Content-type: application/json

```

---

## 📑 Table of Contents

- [User Routes](https://journeysoul-server.onrender.com/api/users)
- [Blog Routes](https://journeysoul-server.onrender.com/api/blogs)
- [Like Unlike Route](https://journeysoul-server.onrender.com/api/blogs/:blogId/like)
- [Comment Route](https://journeysoul-server.onrender.com/api/blogs/:blogId/comments)

---

## 👤 User Routes

### 🔹 Register (Create New User)

**POST** `/api/users/register`

**Body Example:**

```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "123456"
}
```

**Response Example:**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user123",
    "name": "John Doe",
    "email": "john@gmail.com"
  }
}
```

---

### 🔹 Login

**POST** `/api/users/login`

**Body Example:**

```json
{
  "email": "john@gmail.com",
  "password": "123456"
}
```

**Response Example:**

```json
{
  "message": "Login successful",
  "accessToken": "jwt_token_here"
}
```

---

### 🔹 Logout

**POST** `/api/users/logout`

**Headers:**

```
Authorization: Bearer <token>
Content-type: application/json
```

**Response Example:**

```json
{ "message": "Logout successful" }
```

---

### 🔹 Get All Users _(Admin Only)_

**GET** `/api/users`

**Headers:**

```
Authorization: Bearer <admin_token>
Content-type: application/json
```

**Response Example:**

```json
{
  "message": "Users fetched successfully",
  "count": 2,
  "data": [
    {
      "_id": "68f8b4a141a9a63fb79ad2ee",
      "name": "habib",
      "email": "gamil@gmail.com",
      "profileImageUrl": "/images/avater.jpg",
      "role": "user",
      "isSuspended": false,
      "suspendedAt": null,
      "suspensionReason": null,
      "tokenVersion": 0,
      "createdAt": "2025-10-22T10:40:33.542Z",
      "updatedAt": "2025-10-22T10:40:33.542Z",
      "__v": 0
    },
    {
      "_id": "68f8b75341a9a63fb79ad2f2",
      "name": "habib",
      "email": "gamil1@gmail.com",
      "profileImageUrl": "/images/avater.jpg",
      "role": "user",
      "isSuspended": false,
      "suspendedAt": null,
      "suspensionReason": null,
      "tokenVersion": 0,
      "createdAt": "2025-10-22T10:52:03.581Z",
      "updatedAt": "2025-10-22T10:52:03.581Z",
      "__v": 0
    }
  ]
}
```

---

### 🔹 Get User by ID _(Admin & Individual User)_

**GET** `/api/users/:userId`

**Headers:**

```
Authorization: Bearer <admin_token>
Content-type: application/json
```

**Response Example:**

```json
{
  "message": "User fetched successfully",
  "data": {
    "_id": "68f8acaa06fbe88dedcb654a",
    "name": "John Doe",
    "email": "john@gmail.com",
    "role": "user",
    "isSuspended": false
  }
}
```

---

### 🔹 Update User by ID _(Admin & Individual User)_

**PATCH** `/api/users/:userId`

**Headers:**

```
Authorization: Bearer <admin_token>
Content-type: application/json
```

**Body Example:**

```json
{
  "name": "Updated Name of John Doe"
}
```

**Response Example:**

```json
{
  "message": "User updated successfully",
  "data": {
    "id": "68f8acaa06fbe88dedcb654a",
    "name": "Updated Name Of John Doe",
    "email": "john@gmail.com",
    "role": "user",
    "isSuspended": false,
    "profileImageUrl": "/images/avater.jpg"
  }
}
```

---

### 🔹 Delete User by ID _(Admin & Individual User)_

**DELETE** `/api/users/:userId`
**Headers:**

```
Authorization: Bearer <admin_token>

```

**Response Example:**

```json
{
  "message": "User deleted successfully",
  "data": {
    "_id": "68f86dd0c754fe570525215c",
    "email": "abdullah@gmail.com"
  }
}
```

---

### 🔹 Get Profile (Private)

**GET** `/api/users/profile`

**Headers:**

```
Authorization: Bearer <token>
```

---

## 📝 Blog Routes

### 🔹 Get All Blogs

**GET** `/api/blogs`

**Response Example:**

```json
{
  "message" : "Blogs fetch successfully",
  "count" : 1
  [
    {
     "_id": "68f86fd6c754fe570525216c",
     "title": "This is title Hridoy",
     "content": "this demo content form hridoy new update ",
     "image": "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2069",
     "author": {
      "_id": "68f7af778639b757132d8e25",
      "name": "Rashed Mahmud",
      "email": "mahamud2071@gmail.com"
      },
     "likes": [],
     "comments": [
       {
        "user": "68f7af778639b757132d8e25",
        "text": "this is a comment",
        "_id": "68f87160c754fe5705252183",
        "createdAt": "2025-10-22T05:53:36.657Z",
        "updatedAt": "2025-10-22T05:53:36.657Z"
       },
       {
        "user": "68f7af778639b757132d8e25",
        "text": "this is a another comment",
        "_id": "68f871bcc754fe5705252190",
        "createdAt": "2025-10-22T05:55:08.813Z",
        "updatedAt": "2025-10-22T05:55:08.813Z"
       }
     ],
     "createdAt": "2025-10-22T05:47:02.664Z",
     "updatedAt": "2025-10-22T05:55:08.813Z",
     "__v": 4
    }
  ]
}
```

---

### 🔹 Create New Blog _(Logged In User)_

**POST** `/api/blogs`

**Headers:**

```
Authorization: Bearer <token>
Content-type: application/json
```

**Body Example:**

```json
{
  "title": "This is demo title",
  "content": "this demo content ",
  "image": "https://example.com/image.jpg",
  "category": "Adventure"
}
```

```json
{
  "title": "My First Blog",
  "content": "This is my first blog post!",
  "image": "https://example.com/image.jpg",
  "category": "Travel"
}
```

**Response Example:**

```json
{
  "message": "Blog created successfully",
  "blog": {
    "title": "This is demo title",
    "content": "this demo content ",
    "image": "https://example.com/image.jpg",
    "category": "Adventure",
    "author": "68f7af778639b757132d8e25",
    "likes": [],
    "_id": "68f8be5f41a9a63fb79ad305",
    "comments": [],
    "createdAt": "2025-10-22T11:22:07.968Z",
    "updatedAt": "2025-10-22T11:22:07.968Z",
    "__v": 0
  }
}
```

---

### 🔹 Get Blog by ID

**GET** `/api/blogs/:blogId`

---

### 🔹 Update Blog by ID _(Admin & Author Only)_

**PATCH** `/api/blogs/:blogId`

**Body Example:**

```json
{
  "title": "Updated Blog Title",
  "content": "Updated blog content",
  "image": "https://example.com/new-image.jpg",
  "category": "Lifestyle"
}
```

**Response Example:**

```json
{
  "message": "Blog updated successfully",
  "updated": {
    "_id": "68f8be5f41a9a63fb79ad305",
    "title": "Updated Blog Title This is demo title",
    "content": "Updated blog content this demo content",
    "image": "https://example.com/new-image.jpg",
    "author": "68f7af778639b757132d8e25",
    "likes": [],
    "comments": [],
    "createdAt": "2025-10-22T11:22:07.968Z",
    "updatedAt": "2025-10-22T11:28:08.734Z",
    "__v": 0
  }
}
```

---

### 🔹 Delete Blog by ID _(Admin & Author Only)_

**DELETE** `/api/blogs/:blogId`

**Response Example:**

```json
{
  "message": "Blog deleted successfully"
}
```

---

## ❤️ Likes and 💬 Comments Routes

### 🔹 Like or Unlike a Blog

**POST** `/api/blogs/:blogId/like`

**Headers:**

```
Authorization: Bearer <token>

```

**Response Example:**

```json
{
  "message": "Liked successfully",
  "likes": 1
}
```

---

### 🔹 Create Comment on Blog

**POST** `/api/blogs/:blogId/comments`

**Body Example:**

```json
{
  "text": "Amazing post!"
}
```

**Response Example:**

```json
{
  "message": "Comment added successfully",
  "comment": {
    "_id": "comment123",
    "text": "Amazing post!"
  }
}
```

---

### 🔹 Get All Comments on Blog

**GET** `/api/blogs/:blogId/comments`

**Response Example:**

```json
[
  {
    "_id": "comment123",
    "text": "Nice post!",
    "user": "user123"
  }
]
```

---

### 🔹 Update Comment _(Admin & Comment Owner Only)_

**PATCH** `/api/blogs/:blogId/comments/:commentId`

**Body Example:**

```json
{
  "text": "Edited comment text"
}
```

**Response Example:**

```json
{
  "message": "Comment updated successfully"
}
```

---

### 🔹 Delete Comment _(Admin & Comment Owner Only)_

**DELETE** `/api/blogs/:blogId/comments/:commentId`

**Response Example:**

```json
{
  "message": "Comment deleted successfully"
}
```

---

## 🧾 Status Codes

| Code | Meaning                                           |
| ---- | ------------------------------------------------- |
| 200  | OK — Successful request                           |
| 201  | Created — Resource successfully created           |
| 400  | Bad Request — Missing or invalid data             |
| 401  | Unauthorized — Missing or invalid token           |
| 403  | Forbidden — Access denied                         |
| 404  | Not Found — Resource doesn’t exist                |
| 500  | Server Error — Something went wrong on the server |

---

## 🚀 Quick Start

### Run Locally

```bash
git clone <your-repo-url>
cd journeysoul-server
npm install
npm start
```

### Create a `.env` file:

```
PORT=3500
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## ✨ Author

**Rashed Mahmud**
Junior Web Developer | MERN Stack Enthusiast
📧 Email: [mahamud2071@example.com](mahamdu2071@example.com)
💻 GitHub: [https://github.com/rashed-mahmud2](https://github.com/rashed-mahmud2)

```

---

If you want, I can also **add clickable links for each section in the Table of Contents** so readers can jump directly to Users, Blogs, Comments, etc. — that will make your README look professional like a real API doc.

Do you want me to do that?
```
