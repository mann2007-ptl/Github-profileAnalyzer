# 🚀 GitHub Profile Analyzer

A **React.js web application** that analyzes GitHub profiles using the **GitHub REST API**.
Users can search any GitHub username and instantly view profile information, repository data, language statistics, and contribution insights.

🔗 **Live Demo**
https://mannpatel-githubanalyser.netlify.app/

---

# 📌 Project Overview

GitHub Profile Analyzer helps users quickly explore GitHub profiles without navigating through GitHub manually.
It fetches real-time data from the GitHub API and presents it in a **clean, organized, and responsive UI**.

This project demonstrates:

* React component architecture
* API integration
* Data visualization
* Modern frontend development practices

---

# ✨ Features

🔍 Search any GitHub username
👤 View profile information (avatar, bio, followers, etc.)
📦 Display public repositories
📊 Repository statistics
🌐 Language usage chart
📈 Contribution activity visualization
⚡ Fast and responsive interface

---

# 🛠️ Tech Stack

**Frontend**

* React.js
* JavaScript (ES6+)
* CSS

**Build Tool**

* Vite

**API**

* GitHub REST API

**Deployment**

* Netlify

---

# 📂 Project Structure

```bash
Github-profileAnalyzer
│
├── public
│
├── src
│   │
│   ├── assets
│   │
│   ├── components
│   │   ├── ContributionActivity.jsx
│   │   ├── LanguageChart.jsx
│   │   ├── ProfileCard.jsx
│   │   ├── RepoList.jsx
│   │   ├── SearchBar.jsx
│   │   └── Stats.jsx
│   │
│   ├── utils
│   │   └── githubApi.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

# ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1️⃣ Clone the repository

```bash
git clone https://github.com/mann2007-ptl/Github-profileAnalyzer.git
```

### 2️⃣ Navigate to project directory

```bash
cd Github-profileAnalyzer
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Start the development server

```bash
npm run dev
```

The application will start at:

```
http://localhost:5173
```

---

# 🌐 GitHub API

This project uses the **GitHub REST API** to fetch user data.

Example endpoint:

```
https://api.github.com/users/{username}
```

Official documentation:
https://docs.github.com/en/rest

---

# 🚀 Future Improvements

* Repository sorting by stars
* GitHub contribution heatmap
* Dark / Light theme toggle
* Repository search & filters
* Better data visualizations

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a Pull Request

---

# 👨‍💻 Author

**Mann Patel**

GitHub:
https://github.com/mann2007-ptl

---

⭐ If you found this project useful, consider giving it a **star**!
