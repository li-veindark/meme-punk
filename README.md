# MemeHustle

**MemeHustle** is a full-stack MERN application where users can upload, vote on, and battle memes in a competitive dueling system. The platform features AI-powered content generation, a real-time bidding system with a simulated economy, and pages for trending content.

![MemeHustle Screenshot](client/src/assets/preview.jpg)

---

## 🚀 Core Features

*   **🌐 Meme Feed & Voting:** Browse an infinite scroll feed of memes. Upvote or downvote memes, with your vote visually highlighted.
*   **⬆️ Meme Upload:** Upload your own images, add a title and tags, and share them with the community.
*   **✨ AI Content Generation:** Don't have a witty caption? Let Google's Gemini Vision model generate a "caption" and "vibe" for your meme based on the image content.
*   **🔥 Trending Page:** See the top 3 most upvoted memes, complete with gold, silver, and bronze rankings.
*   **⚔️ Dueling & Bidding System:**
    *   Initiate a duel between two random memes.
    *   A 10-minute countdown timer starts as soon as the first bid is placed.
    *   Users can bid simulated ETH on the meme they think will win.
    *   When the timer ends, the meme with the highest total bid value wins.
    *   All users who bid on the winning meme receive a **2x payout** of their original bid.
*   **👤 User Management:** A simple user selection system tracks voting history and a simulated ETH balance for bidding.

---

## 🛠️ Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS
*   **Backend:** Node.js, Express.js
*   **Database:** Prisma ORM
*   **File Uploads:** Multer
*   **AI Integration:** Google Gemini (`@google/generative-ai`)
*   **Real-time Communication:** Socket.IO

---

## ⚙️ Getting Started

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (or your preferred package manager)
*   A running PostgreSQL (or other SQL) database instance

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/li-veindark/meme-punk.git
    cd meme-punk
    ```

2.  **Setup the Backend**
    ```bash
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install

    # Create your environment file
    cp .env.example .env
    ```
    Next, open the `.env` file and fill in your `DATABASE_URL` and `GEMINI_API_KEY`.
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
    PORT=5000
    ```

    **Apply Database Migrations**
    This will set up your database schema based on the models in `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```
    
    **(Optional) Seed the Database**
    To populate your database with initial users and memes:
    ```bash
    npx prisma db seed
    ```

3.  **Setup the Frontend**
    ```bash
    # Navigate to the client directory from the root
    cd client

    # Install dependencies
    npm install
    ```

### Running the Application

1.  **Start the Backend Server**
    From the `server` directory:
    ```bash
    npm run dev
    ```
    The server should now be running on `http://localhost:5000`.

2.  **Start the Frontend Development Server**
    From the `client` directory:
    ```bash
    npm run dev
    ```
    The application should now be accessible at `http://localhost:5173`.

---

## 📖 Usage

1.  **Select a User:** The app starts on a user selection screen. Choose a user to begin.
2.  **Browse Memes:** Scroll through the home page to view all memes.
3.  **Vote:** Click the up or down arrows on any meme card to cast your vote.
4.  **Upload a Meme:** Navigate to the "Upload" page, select an image, and fill out the form. Use the "Generate" button to get AI-powered suggestions for the caption and vibe.
5.  **Start a Duel:** Go to the "Duel" page and click "Start New Duel" to begin a battle. Place bids on your favorite meme and watch the timer.

---

## Project Structure

```
.
├── client/         # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── ...
└── server/         # Node.js Backend (Express)
    ├── prisma/
    │   ├── migrations/
    │   └── schema.prisma
    ├── public/
    │   └── uploads/
    ├── routes/
    └── services/
```
