# Todo App Backend

A RESTful API server for the fullstack todo application built with Express.js and Node.js.

## Features

- Full CRUD operations for todos
- CORS enabled for cross-origin requests
- Health check endpoint
- JSON data persistence
- Express.js framework

## API Endpoints

### Todos

#### Get All Todos
```
GET /api/todos
```
Returns all todos in the system.

**Response:**
```json
[
  {
    "id": 1,
    "text": "Sample todo",
    "completed": false
  }
]
```

#### Create a New Todo
```
POST /api/todos
```
Creates a new todo item.

**Request Body:**
```json
{
  "text": "Todo description",
  "completed": false
}
```

**Response:**
```json
{
  "id": 2,
  "text": "Todo description",
  "completed": false
}
```

#### Update a Todo
```
PUT /api/todos/:id
```
Updates an existing todo by ID.

**Request Body:**
```json
{
  "text": "Updated todo description",
  "completed": true
}
```

**Response:**
```json
{
  "id": 1,
  "text": "Updated todo description",
  "completed": true
}
```

#### Delete a Todo
```
DELETE /api/todos/:id
```
Deletes a specific todo by ID.

**Response:**
```json
{
  "message": "Todo deleted successfully"
}
```

#### Delete All Completed Todos
```
DELETE /api/todos
```
Deletes all todos that are marked as completed.

**Response:**
```json
{
  "message": "Completed todos deleted successfully"
}
```

### Health Check

#### Health Status
```
GET /health
```
Returns the health status of the API.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ"
}
```

## Running Locally

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tobyp2233/fullstack-todo-app.git
cd fullstack-todo-app/backend
```

2. Install dependencies:
```bash
npm install
```

### Starting the Server

#### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for automatic restarts during development.

#### Production Mode
```bash
npm start
```
This will start the server in production mode.

### Environment Variables

The server uses the following environment variables:

- `PORT`: Server port (default: 3001)

You can create a `.env` file in the backend directory to set these variables:

```env
PORT=3001
```

### Server Information

- **Default Port:** 3001
- **CORS:** Enabled for all origins
- **Data Storage:** In-memory (resets on server restart)

## Deployment

### Heroku Deployment

1. Install the Heroku CLI
2. Login to Heroku:
```bash
heroku login
```

3. Create a new Heroku app:
```bash
heroku create your-todo-app-backend
```

4. Set environment variables:
```bash
heroku config:set NODE_ENV=production
```

5. Deploy:
```bash
git push heroku main
```

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Set the build command: `npm install`
3. Set the start command: `npm start`
4. Deploy from the Railway dashboard

### Docker Deployment

Create a `Dockerfile` in the backend directory:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t todo-backend .
docker run -p 3001:3001 todo-backend
```

### Environment Variables for Production

For production deployment, ensure these environment variables are set:

- `NODE_ENV=production`
- `PORT=3001` (or as required by your hosting platform)

## Project Structure

```
backend/
├── package.json          # Dependencies and scripts
├── server.js            # Main server file
└── README.md           # This file
```

## Dependencies

- **express**: Fast, unopinionated web framework for Node.js
- **cors**: Middleware for enabling Cross-Origin Resource Sharing
- **nodemon**: Development dependency for auto-restarting the server

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
