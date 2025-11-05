# 🚀 TaskFlow – Modern SaaS Project Management Platform

TaskFlow is a **modern SaaS project management platform** built to simplify teamwork and task organization.  
It provides **real-time collaboration**, **Supabase authentication**, **drag-and-drop Kanban boards**, and a **clean, responsive design** inspired by Linear and Notion.

---

## 🌟 Features

- 🔐 **Supabase Authentication** – Secure login with email/password.
- 📊 **Dashboard** – Real-time project statistics and analytics.
- 🗂️ **Project & Task Management** – Full CRUD with Kanban-style drag and drop.
- 💬 **Realtime Chat** – Live messaging powered by Supabase Realtime subscriptions.
- 📱 **Fully Responsive UI** – Optimized for desktop, tablet, and mobile.
- 🔒 **Row Level Security (RLS)** – All data protected through Supabase policies.
- 🎨 **Modern Design** – Minimalistic and smooth UI inspired by Linear and Notion.

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | **Next.js**, **TypeScript**, **Tailwind CSS** |
| Backend | **Supabase (PostgreSQL, Auth, Realtime)** |
| Hosting | **Vercel** |
| State Management | **React Hooks**, **Supabase Realtime Subscriptions** |

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Nemroder/taskflow-app
cd taskflow-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server
```bash
npm run dev
```

Then open http://localhost:3000
 to view the app.

---

### 🧩 Project Structure
```bash
taskflow/
├── components/      # UI components
├── lib/             # Supabase client and utilities
├── app/             # Next.js App Router pages and layouts
├── styles/          # Global styles
├── public/          # Images and static assets
└── README.md
```

---

### 📜 License
This project is licensed under the MIT License

---

### 💡 Inspiration

TaskFlow was designed with inspiration from Linear and Notion, focusing on clarity, speed, and collaboration.

## 🌐 Demo
🔗 [Live Demo](https://taskflow-app-green.vercel.app/)

## 👨‍💻 Author
Sergio Gutierrez

- 📧 [Email](sergioalejandrogutierrezmedina@gmail.com) • [Portfolio](https://sergiogutierrez.vercel.app/)
- 💼 [LinkedIn](https://www.linkedin.com/in/sergio-gutierrez-741283277/) • [GitHub](https://github.com/Nemroder)

---
💙 Built with passion and focus by Sergio Gutierrez.
