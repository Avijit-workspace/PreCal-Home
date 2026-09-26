# PreCal Home (RenoAI) 🏡✨

> The Future of Smart Renovation: Precision Material Estimates for Your Dream Space

PreCal Home is an AI-powered home renovation platform that eliminates guesswork from interior design and renovation projects. By simply uploading a photo of a room, users get instant design recommendations, precise material estimates, budget breakdowns, and seamless connections to verified local professionals.

---

## 🛑 The Problem

Home renovation is often overwhelming and fraught with uncertainty. Homeowners typically face the following challenges:
- **Inaccurate Estimations:** Guessing material quantities leads to overbuying (waste of money) or underbuying (project delays).
- **Lack of Visualization:** It's hard to visualize how a color palette, furniture piece, or layout change will look in a real space.
- **Budget Overruns:** Hidden costs and lack of transparent budget breakdowns make financial planning difficult.
- **Finding Reliable Experts:** Searching for, vetting, and booking trustworthy local professionals (carpenters, painters, contractors) is tedious and time-consuming.

---

## 💡 The Solution

PreCal Home solves these problems by providing an all-in-one, AI-driven platform:
- **AI Image Analysis:** Instantly analyze room photos to identify dimensions, materials, and renovation opportunities.
- **Automated Bill of Materials (BOM):** Auto-generate a complete material list with accurate quantities to avoid waste and optimize cost.
- **Smart Design Recommendations:** Get personalized color palettes and material suggestions tailored to your budget and property type.
- **Comprehensive Cost Estimation:** Transparent breakdowns across materials, labor, and logistics with customizable tiers (Luxury, Moderate, Budget).
- **Verified Local Booking:** Directly connect with and book verified local painters, carpenters, and designers based on AI recommendations.

---

## 🏗️ Architecture & Tech Stack

PreCal Home is built using a modern, scalable, and responsive frontend architecture.

### Tech Stack
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Data Visualization:** Recharts

### High-Level Application Architecture
1. **Public Layer:** Landing Page with promotional content, Before/After showcases, and feature highlights.
2. **Authentication Layer:** Login and Registration flows using Context-based State Management.
3. **Protected Application (Dashboard):**
   - **Dashboard (Overview):** User stats, recent analyses, and saved projects.
   - **Analysis Engine:** Image upload interface for space analysis, design preference collection (budget, style).
   - **Result Engine:** Presentation of AI-processed data including Bills of Materials, cost charts (via Recharts), and visual recommendations.
   - **Marketplace (Professionals):** Directory to discover and book local experts.
   - **User Management:** Profile and Project history.

---

## 📂 Project Structure

```text
PreCal-Home/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── assets/             # Images and local media
│   ├── components/         # Reusable UI components (Navbar, Footer, Toast, etc.)
│   ├── context/            # React Context (e.g., AppContext for Auth/State)
│   ├── data/               # Mock data or static configurations
│   ├── layouts/            # Application layouts (DashboardLayout, etc.)
│   ├── pages/              # Page components
│   │   ├── LandingPage.tsx
│   │   ├── AuthPages.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AnalysisPage.tsx
│   │   ├── AnalysisResultPage.tsx
│   │   ├── ProfessionalsPage.tsx
│   │   ├── MyProjectsPage.tsx
│   │   └── ProfilePage.tsx
│   ├── types/              # TypeScript interfaces and type definitions
│   ├── App.tsx             # Main Application routing and providers
│   ├── main.tsx            # React DOM entry point
│   └── index.css           # Global styles and Tailwind imports
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd PreCal-Home
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to view the application.

### Build for Production
To build the app for production, run:
```bash
npm run build
```
The optimized files will be generated in the `dist` folder.

---

## 🎯 Usage Flow

1. **Sign Up / Log In:** Create an account to save your renovation projects.
2. **Upload a Space:** Go to "New Analysis" and upload a photo of the room you want to renovate.
3. **Set Preferences:** Choose your budget tier, property type, and desired design style.
4. **Get AI Results:** Review the auto-generated Bill of Materials, total estimated cost (with charts), and design recommendations.
5. **Book Experts:** Navigate to the Professionals directory to find and book local contractors who fit your project needs.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is proprietary and confidential. All rights reserved.
