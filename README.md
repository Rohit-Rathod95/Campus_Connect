🏫 Campus Connect — Student Accommodation Made Simple
Campus Connect is a fullstack web application designed to simplify the process of finding student accommodations near college campuses. Whether you’re a student looking for a PG, hostel, flat, or mess — or an owner wanting to list your property — Campus Connect offers a secure and easy-to-use platform to connect both sides.

🚀 Key Highlights
👩‍🎓 For Students:
✅ Register/Login securely with JWT authentication
🏫 Select your college from a dynamic dropdown (auto-fetches city)
🏠 View accommodation listings filtered by your college
🗺️ Live map preview using Leaflet.js
🔍 See details like price, type (mess/PG/hostel/flat), location, and contact info

🧑‍💼 For Owners:
✅ Register/Login securely with role-based access
📝 Add new listings (title, type, price, coordinates, address)
🎓 Associate listings with colleges
📋 See your current listings with edit-ready data
📍 Preview location on interactive maps

🛠️ Tech Stack
Layer	Technology
Frontend	React.js, Axios, Leaflet.js
Backend	Node.js, Express.js, JWT
Database	MySQL
Maps	Leaflet.js (OpenStreetMap-based)
Styling	CSS (handwritten, clean UI)

📁 Folder Structure
bash
Copy
Edit
my_campus/
│
├── frontend/        # React.js frontend
│   └── src/
│       ├── pages/
│       ├── components/
│       └── App.jsx
│
├── backend/         # Node.js + Express API
│   ├── controllers/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   └── middleware/
│
├── README.md
└── .gitignore

🔐 Authentication
🔑 JSON Web Tokens (JWT) are used for secure session handling.
🧠 Role-based access control (student, owner) is implemented.
🔐 Passwords are hashed using bcrypt before storing in MySQL.

🌐 Features In Action
✅ Owner Dashboard: add listings, manage properties
✅ Student Dashboard: view nearby PG/hostel options
✅ Auto-college detection & filtering
✅ Leaflet map integration to visualize exact location

🏁 How To Run Locally
# 📦 Backend
cd backend
npm install
npm start

# 🌐 Frontend
cd frontend
npm install
npm start

🧪 Future Improvements
📸 Image uploads for listings
🔍 Search and filter by price/type
📱 Responsive design for mobile
📨 Contact owner via in-app messaging

🙌 Acknowledgments
This project was built to solve a real-world problem faced by students across India while shifting to new cities. Built from scratch using fullstack principles and clean architecture.
