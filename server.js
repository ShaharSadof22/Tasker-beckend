const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')

const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Express App Config
app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    };
    app.use(cors(corsOptions));
}

const taskRoutes = require('./api/task/task.routes')
const {connectSockets} = require('./api/socket/socket.routes')


// routes
app.use('/api/task', taskRoutes)
connectSockets(io)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3000/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow react-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const port = process.env.PORT || 3030;
http.listen(port, () => {
    console.log('Server is running on port: ' + port)
});




// const data = [{
//     "title": "Go to surf",
//     "description": "Take the board and drive to the beach",
//     "importance": 3,
//     "createdAt": 23324234,
//     "lastTriedAt": null,
//     "triesCount": 0,
//     "doneAt": null
// }, {
//     "title": "Try the new React Hooks",
//     "description": "Search for some new courses!",
//     "importance": 2,
//     "createdAt": 23324223134,
//     "lastTriedAt": null,
//     "triesCount": 0,
//     "doneAt": null
// }, {
//     "title": "Fix the car",
//     "description": "Just try to...",
//     "importance": 1,
//     "createdAt": 233242213134,
//     "lastTriedAt": null,
//     "triesCount": 0,
//     "doneAt": null
// }]
