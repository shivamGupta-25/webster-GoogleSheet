# 🌐 Websters - Computer Science Society of Shivaji College

<div align="center">
  
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)

</div>

A modern web application for managing and showcasing technical events, workshops, and registrations for Websters - the technical society of Shivaji College, University of Delhi.

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Websters+Website" alt="Websters Website Preview" width="80%" />
</div>

## ✨ Features

<div align="center">
  
| 🎮 **Event Management** | 🧩 **Workshop Registration** | 📊 **Admin Dashboard** |
|:----------------------:|:----------------------------:|:----------------------:|
| Showcase and manage technical events like Techelons | Handle registrations for technical workshops | Manage registrations, events, and site content |

| 📱 **Responsive Design** | 🗄️ **MongoDB Integration** | 🔐 **Firebase Authentication** |
|:------------------------:|:---------------------------:|:-----------------------------:|
| Optimized for all device sizes | Store and manage all data efficiently | Secure user authentication and authorization |

</div>

## 🛠️ Tech Stack

<details>
<summary>Click to expand</summary>

### Frontend
- **Framework**: Next.js 15, React 19
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI, Headless UI, Framer Motion

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Auth

### Utilities
- **Email**: Nodemailer, Resend
- **Form Handling**: React Hook Form, Zod validation
- **Deployment**: Vercel

</details>

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- MongoDB database
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/websters-v2.git
   cd websters-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # Email
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   
   # Admin
   ADMIN_EMAIL=admin_email_address
   
   # JWT
   JWT_SECRET=your_jwt_secret
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 📂 Project Structure

```
websters-v2/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── _components/      # Shared components for the app
│   │   ├── _data/            # Static data files
│   │   ├── _utils/           # Utility functions
│   │   ├── admin/            # Admin dashboard
│   │   ├── api/              # API routes
│   │   ├── techelons/        # Techelons event page
│   │   └── ...               # Other pages and routes
│   ├── components/           # Global components
│   ├── lib/                  # Library code and utilities
│   ├── models/               # MongoDB models
│   └── scripts/              # Utility scripts
├── public/                   # Static assets
└── ...                       # Config files
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run migrate` | Run database migration script |
| `npm run cleanup` | Clean up static files |
| `npm run update-imports` | Update component imports |

## 🌩️ Deployment

The application is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure the environment variables in Vercel
4. Deploy the application

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Developers

- Websters Technical Society, Shivaji College, University of Delhi

## 📞 Contact

For any queries or support, please contact:

- **Developed by**: [Shivam Raj Gupta](https://www.linkedin.com/in/shivam-raj-gupta/) (guptashivam25oct@gmail.com)
- **Email**: websters@shivaji.du.ac.in
- **Website**: [websters.shivaji.du.ac.in](https://websters.shivaji.du.ac.in)

<div align="center">
  <img src="https://via.placeholder.com/100?text=W" alt="Websters Logo" width="50px" />
  <p>© 2023 Websters - Computer Science Society of Shivaji College</p>
</div>
