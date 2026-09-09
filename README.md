# 🔗 Pathshort — URL Shortener with Real-Time Analytics

Pathshort is a full-stack URL shortener built for people who want more than just a shorter link — it tracks every click, shows where traffic is coming from, and visualizes performance through a live analytics dashboard.

Most link shorteners stop at "shorten and redirect." Pathshort goes further by treating every link as a small data source: who clicked it, when, and from where — then surfacing that in a clean, readable dashboard.

## 🚀 Live Demo
- **App:** [your-vercel-link.vercel.app]
- **API:** [your-render-link.onrender.com]

![Pathshort Dashboard](./screenshot.png)

## ✨ Key Features
- **Instant shortening** — turn any long URL into a compact, shareable link
- **Smart redirects** — fast lookup and redirect from short code to original URL
- **Click analytics** — every click logged with timestamp and referrer data
- **Visual dashboard** — see performance per link with charts, not just numbers
- **Clean REST API** — predictable, well-structured endpoints built for extension

## 🛠️ Built With
| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Frontend | React, [Recharts / Chart.js] |
| Deployment | Render (API), Vercel (client) |

## 📡 API Reference
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shorten` | Create a short link from a long URL |
| `GET` | `/:shortCode` | Redirect to the original URL, logs the click |
| `GET` | `/api/urls` | Fetch all links with total click counts |
| `GET` | `/api/urls/:shortCode/stats` | Fetch detailed click history for one link |

## ⚙️ Getting Started

Clone and enter the project:
```bash
git clone https://github.com/yourusername/pathshort.git
cd pathshort
```

Install dependencies:
```bash
npm install
```

Set up your environment variables — create a `.env` file:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start the server:
```bash
npm start
```

## 🧠 Engineering Notes
Building Pathshort meant thinking beyond CRUD:
- Designing a schema that could efficiently track time-series click events per link
- Handling redirect logic without adding latency to the user's experience
- Structuring the API so analytics could scale (more metrics, more filters) without a rewrite
- Turning raw click data into something visually useful on the frontend

## 📌 Roadmap
- Custom, user-defined short codes
- QR code generation per link
- Auth so users can manage their own set of links
- Geographic click data (country/city breakdown)

## 📄 License
MIT

---
*Built by [Your Name] — [portfolio link] · [LinkedIn] · [GitHub]*
