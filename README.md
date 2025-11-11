# E-Commerce Website (ISC)

A full-stack e-commerce application built with React (TypeScript) frontend and Node.js backend.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Built with React 18, TypeScript, and Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Authentication**: JWT-based authentication with protected routes
- **Shopping Cart**: Add to cart, quantity management, and checkout
- **Product Management**: Browse products, categories, search, and filters
- **Admin Panel**: Complete admin interface for managing products, orders, and users
- **Payment Integration**: Stripe payment processing
- **Responsive Design**: Mobile-first responsive design
- **Internationalization**: Multi-language support (English/Vietnamese)

### Backend (Node.js + Express)
- **RESTful API**: Express.js with structured routing
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens with refresh token mechanism
- **File Upload**: Image upload and processing
- **Email Service**: Email notifications and verification
- **Payment Processing**: Stripe integration
- **AI Integration**: Gemini AI for product descriptions
- **Logging**: Structured logging with Winston
- **Security**: CORS, rate limiting, and input validation

## 📁 Project Structure

```
ISC/
├── be/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── scripts/            # Database migration scripts
│   └── uploads/            # File upload directory
├── fe/                     # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Redux slices and feature logic
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
└── docs/                   # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Ant Design** - UI components
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Stripe** - Payment processing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Multer** - File upload
- **Winston** - Logging
- **Stripe** - Payment processing
- **Gemini AI** - AI integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ISC
   ```

2. **Install Backend Dependencies**
   ```bash
   cd be
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../fe
   npm install
   ```

4. **Database Setup**
   
   Follow the instructions in `docs/DATABASE_SETUP.md` for detailed database configuration.

   Quick setup:
   ```bash
   # Configure your database connection in be/.env
   cd be
   
   # Set DB_SYNC=true for initial setup
   node src/server.js
   
   # Import sample data
   node scripts/import-hybrid-products.js
   node scripts/create-admin-user.js
   
   # Set DB_SYNC=false after setup
   ```

5. **Environment Configuration**
   
   Update the `.env` file in the `be` directory with your configuration:
   ```env
   # Database
   DB_HOST=your_db_host
   DB_PORT=5432
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   
   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   
   # Other configurations...
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd be
   npm run dev
   # or
   node src/server.js
   ```
   Backend will run on `http://localhost:8888`

2. **Start Frontend Development Server**
   ```bash
   cd fe
   npm run dev
   ```
   Frontend will run on `http://localhost:5175`

3. **Access the Application**
   - **Customer Interface**: `http://localhost:5175`
   - **Admin Panel**: `http://localhost:5175/admin-login.html`
   - **Admin Credentials**: 
     - Email: `admin@example.com`
     - Password: `Admin@123`

## 📚 API Documentation

The backend provides RESTful APIs for:

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Categories**: `/api/categories/*`
- **Cart**: `/api/cart/*`
- **Orders**: `/api/orders/*`
- **Users**: `/api/users/*`
- **Admin**: `/api/admin/*`

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm start          # Start production server
node src/server.js # Start development server
```

**Frontend:**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Database Migration

```bash
# Create database structure
node src/server.js

# Import sample products
node scripts/import-hybrid-products.js

# Create admin user
node scripts/create-admin-user.js
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Ensure PostgreSQL database is accessible
3. Run `node src/server.js`

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation in the `docs/` folder
2. Review the troubleshooting section in `docs/DATABASE_SETUP.md`
3. Create an issue in the repository

## 🏗️ Architecture

This application follows a modern full-stack architecture:

- **Frontend**: Single Page Application (SPA) with React
- **Backend**: RESTful API with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT-based with refresh tokens
- **File Storage**: Local file system (configurable for cloud storage)
- **Payment**: Stripe integration
- **AI**: Gemini AI for enhanced features

## 📊 Database Schema

The application uses the following main entities:
- Users (customers and admins)
- Products with variants and attributes
- Categories
- Orders and order items
- Cart and cart items
- Reviews and ratings
- Images and file uploads

For detailed database schema, see the models in `be/src/models/`.
