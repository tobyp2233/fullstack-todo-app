# Todo App Frontend

A modern React-based todo application with a clean, intuitive interface for managing your daily tasks.

## 📋 Features

- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Real-time Updates**: Seamless synchronization with the backend API
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Intuitive UI**: Clean and modern user interface built with React
- **Persistent Storage**: Tasks are saved and persist across browser sessions
- **Filter & Search**: Easily find and organize your tasks

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tobyp2233/fullstack-todo-app.git
cd fullstack-todo-app/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

## 🛠 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. The page will reload if you make edits.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`
**Note: this is a one-way operation. Once you eject, you can't go back!**

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy to Static Hosting

The app can be deployed to any static hosting service:

#### Netlify
1. Build the project: `npm run build`
2. Drag and drop the `build` folder to Netlify
3. Configure redirects for single-page app routing

#### Vercel
```bash
npm i -g vercel
vercel --prod
```

#### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/fullstack-todo-app",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Deploy: `npm run deploy`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=10000

# App Configuration
REACT_APP_TITLE=Todo App
REACT_APP_VERSION=1.0.0

# Development
REACT_APP_DEBUG=false
```

### API Integration

The app expects a REST API with the following endpoints:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

### Customization

#### Styling
- CSS files are located in `src/styles/`
- Global styles in `src/index.css`
- Component-specific styles use CSS modules or styled-components

#### Components
- Main app component: `src/App.js`
- Reusable components in `src/components/`
- Utility functions in `src/utils/`

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── TodoList.js
│   │   ├── TodoItem.js
│   │   └── AddTodo.js
│   ├── styles/
│   │   └── App.css
│   ├── utils/
│   │   └── api.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Dependencies issues**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Build fails**
- Check that all environment variables are set correctly
- Ensure Node.js version compatibility
- Verify all imports and exports are correct

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

If you encounter any issues or have questions, please:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the project documentation

---

**Happy coding! 🚀**
