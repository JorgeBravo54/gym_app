# Flask Gym/Comments App

This is a simple web application built with **Flask** that allows users to:
- Create, manage and save their gym routines
- Create comments
- Edit and update their own comments
- Delete comments
- View all comments in a styled interface

This project demonstrates a CRUD workflow with a Flask backend.

---

## Features
- User authentication via session
- RESTful API endpoints for comments (`GET`, `POST`, `PUT`, `DELETE`)
- Frontend rendering with dynamic comment boxes
- Edit/Save/Cancel functionality for comments

---

## 🛠 Tech Stack
- **Backend:** Flask (Python)
- **Frontend:** HTML, CSS, JavaScript
- **Database:** (SQLite)
- **Dependencies:**  
  - Flask  
  - bcrypt  
  - requests  
  - gunicorn

---
---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/JorgeBravo54/gym_app.git
cd gym_app
pip install -r requirements.txt
flask run


