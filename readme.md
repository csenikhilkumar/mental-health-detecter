# 🧠 AI Mental Health Detector

An AI-powered web application that helps users track their mental health by analyzing journal entries and providing mood insights, suggestions, and well-being patterns.

---

## 🚀 Features

- ✍️ **Journal Logging** – Users can write daily entries about their mood and experiences.  
- 🤖 **AI-Powered Analysis** – Uses NLP/AI models to analyze text and detect emotional state.  
- 📊 **Mood Tracking** – Provides insights into mood trends over time.  
- 🔐 **Authentication** – Secure user login and registration with JWT.  
- 🗂️ **Database Integration** – Stores user data and journals in a relational database.  
- 🎨 **Modern UI** – Built with React & Tailwind CSS for a clean, responsive design.  

---

## 🏗️ Tech Stack

### **Frontend**
- React (Vite) ⚡
- TypeScript
- Tailwind CSS
- Axios (API integration)

### **Backend**
- Node.js & Express
- Prisma ORM
- PostgreSQL (Database)
- JWT Authentication
- Zod (Validation)

### **AI Integration**
- OpenAI / Gemini API for text sentiment & suggestion generation

---

## 📂 Project Structure

```
ai-mental-health-detector/
│── apps/
│   ├── frontend/   # React + Vite client
│   ├── backend/    # Express + Prisma API
│
│── packages/
│   ├── database/   # Prisma schema & client
│   ├── common/     # Shared Zod validation schemas
│
│── turbo.json      # Monorepo config
│── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/ai-mental-health-detector.git
cd ai-mental-health-detector
```

### 2️⃣ Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3️⃣ Setup Environment Variables  
Create a `.env` file inside `apps/backend/`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mentalhealthdb
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

### 4️⃣ Database Migration
```bash
cd apps/backend
npx prisma migrate dev
```

### 5️⃣ Start Development Servers
Frontend:
```bash
cd apps/frontend
npm run dev
```

Backend:
```bash
cd apps/backend
npm run dev
```

---

## 📌 API Endpoints

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| POST   | `/api/v1/signUp`      | Register new user          |
| POST   | `/api/v1/signIn`      | User login (returns token) |
| POST   | `/api/v1/journal`     | Create a journal entry     |
| GET    | `/api/v1/journal/:id` | Get journal by ID          |
| GET    | `/api/v1/journals`    | Get all user journals      |

---

## 🧪 Example AI Response

**Input Journal:**
```
I feel anxious today because of exams. Couldn’t sleep properly.
```

**AI Output:**
- **Mood:** Anxious 😟  
- **Suggestion:** Try deep breathing exercises or a short walk.  
- **Encouragement:** Remember, it’s okay to feel nervous. You’ve prepared well! 💪  

---

## 🛡️ Security

- JWT Authentication for protected routes  
- Encrypted passwords with **bcrypt**  
- Input validation using **Zod**  
- Secure database handling with **Prisma**  

---

## 📌 Future Enhancements

- 📱 Mobile App (React Native)  
- 🧭 Personalized Mental Health Dashboard  
- 🗣️ Voice Journaling with AI transcription  
- 🌐 Multi-language support  

---

## 👨‍💻 Contributors

- **Your Name (Nikhil)** – Full Stack Developer  

---

## 📜 License

This project is licensed under the MIT License.