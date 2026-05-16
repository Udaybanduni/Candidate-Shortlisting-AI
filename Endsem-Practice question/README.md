# Candidate Profile Shortlisting System 🚀

A full-stack web application designed to help recruiters streamline their hiring process. This system allows for the management of candidate profiles and provides both basic algorithmic matching and advanced AI-powered shortlisting using the OpenRouter API.

Developed as a college end-semester project.

---

## 🌟 Features

*   **Candidate Management:** Add and store candidate profiles including their name, email, skills, experience, bio, and notable projects.
*   **Basic Logic Matching:** 
    *   Compare a candidate's profile against recruiter job requirements.
    *   Calculates a match percentage based on required and preferred skills.
    *   Penalizes candidates if they do not meet the minimum experience requirement.
    *   Categorizes matches into High, Medium, or Low.
*   **AI-Powered Shortlisting:** 
    *   Integrates with the **OpenRouter API** (using `google/gemini-2.5-flash`).
    *   Analyzes the candidate pool against job descriptions and skill requirements.
    *   Ranks the best candidates and provides a detailed, intelligent reasoning for *why* they are a good fit.
*   **Responsive UI:** A clean, modern interface built with Tailwind CSS v4, featuring score visualizations and loading states.

---

## 💻 Tech Stack

**Frontend:**
*   React.js (Vite)
*   Tailwind CSS v4
*   Axios (for API calls)
*   React Router DOM
*   Lucide React (for icons)

**Backend:**
*   Node.js
*   Express.js
*   MongoDB & Mongoose
*   Axios (for OpenRouter API requests)
*   Dotenv (Environment variables)

---

## 🛠️ Installation & Setup

To run this project locally, follow these steps:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a [MongoDB URI](https://www.mongodb.com/) (either local or MongoDB Atlas). You will also need an API key from [OpenRouter](https://openrouter.ai/).

### 2. Clone the repository
\`\`\`bash
git clone https://github.com/Udaybanduni/Candidate-Shortlisting-AI.git
cd Candidate-Shortlisting-AI
\`\`\`

### 3. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`

Create a `.env` file in the `backend` directory with the following variables:
\`\`\`env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
\`\`\`

*(Optional)* Seed the database with sample candidates:
\`\`\`bash
node seed.js
\`\`\`

Start the backend server:
\`\`\`bash
npm run start
\`\`\`

### 4. Frontend Setup
Open a new terminal window/tab:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

The application should now be running. The frontend will be accessible at \`http://localhost:5173\`.

---

## 📁 Project Structure

\`\`\`
Candidate-Shortlisting-AI/
├── backend/                  # Node.js & Express server
│   ├── models/               # Mongoose DB schemas (Candidate.js)
│   ├── routes/               # API Endpoints (candidateRoutes.js, matchRoutes.js)
│   ├── server.js             # Main server entrypoint
│   └── seed.js               # Dummy data generator
│
└── frontend/                 # React frontend
    ├── src/
    │   ├── components/       # Reusable UI (Layout.jsx)
    │   ├── pages/            # View routes (AddCandidate, CandidateList, MatchCandidates)
    │   ├── services/         # Axios configuration
    │   └── App.jsx           # App routing
    └── index.css             # Tailwind configuration
\`\`\`

---

## 🧑‍💻 Author

**Uday Banduni** 
College End-Semester Project