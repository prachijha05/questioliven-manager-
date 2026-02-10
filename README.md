📘  # **Interactive Question Management Sheet**

A modern, interactive single-page web application to manage a hierarchical set of DSA questions organized by Topics → Sub-topics → Questions, inspired by platforms like Codolio / Striver A2Z Sheet.

🚀## Live Demo

🔗** Deployment Link**
👉 (Paste your Vercel URL here)
Example:

https://question-manager-xxx.vercel.app


🔗** GitHub Repository**
👉 https://github.com/prachijha05/question-manager

🧠** Problem Statement**

The goal of this project is to build an interactive question tracking sheet that allows users to:

Organize questions by topics and sub-topics

Track solved/unsolved questions

Reorder items using drag and drop

Perform full CRUD operations

Persist data without a backend database

✨ **Features Implemented**
✅ Core Functional Requirements
📌 Topic Management

View topics dynamically derived from questions

Delete entire topics (removes all associated questions)

📌 Sub-topic Management

Questions grouped automatically under sub-topics

Flexible creation through question addition

📌 Question Management (CRUD)

➕ Add new questions

✏️ Edit existing questions

🗑 Delete questions

☑ Mark questions as solved/unsolved

🔗 Open problem link in a new tab

📌 Reordering

Drag & drop questions within sub-topics

Order is persisted across reloads

🎯 Bonus Features (Improvements)

📊 Progress Dashboard (Solved / Remaining / Completion %)

💾 Persistent state using localStorage

🧩 Modal-based Add/Edit UX

🎨 Clean, dark-themed UI inspired by Codolio

⚡ Fast performance with Vite

🛠 Tech Stack
Frontend

React (Vite)

Tailwind CSS

@hello-pangea/dnd (Drag & Drop)

State Management

Zustand

Data Persistence

localStorage (No backend required)

📂 Project Structure
src/
├── components/
├── pages/
│   └── Home.jsx
├── store/
│   └── useSheetStore.js
├── data/
│   └── sheet.json
├── App.jsx
├── main.jsx
└── index.css

🧪 Sample Data

Initial data is loaded from a static JSON file:

src/data/sheet.json


Structure is compatible with:

curl --location \
'https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet'

▶️ How to Run Locally
# Clone the repo
git clone https://github.com/prachijha05/question-manager.git

# Go to project directory
cd question-manager

# Install dependencies
npm install

# Start development server
npm run dev


Open:

http://localhost:5173

📌 Assumptions

Single-page application

No backend database required

UI design flexibility allowed

All operations handled client-side

🏁 Submission Checklist

✅ React SPA
✅ Tailwind UI
✅ Zustand state management
✅ CRUD operations
✅ Drag & drop reorder
✅ Local persistence
✅ Deployed on Vercel

👩‍💻 Author

Prachi Jha
GitHub: https://github.com/prachijha05

⭐ If you like this project, feel free to star the repo!
