require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json()); // Body parser

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// DB setup
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("DB connected"))
  .catch(err => console.log("DB error:", err.message));

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

const types = ['DDoS', 'Phishing', 'Malware', 'SQL Injection', 'Ransomware', 'Brute Force'];
const locations = [
  { lat: 37.7749, lng: -122.4194, name: 'San Francisco, USA', country: 'USA' },
  { lat: 51.5074, lng: -0.1278, name: 'London, UK', country: 'UK' },
  { lat: 35.6895, lng: 139.6917, name: 'Tokyo, Japan', country: 'Japan' },
  { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia', country: 'Australia' },
  { lat: 55.7558, lng: 37.6173, name: 'Moscow, Russia', country: 'Russia' },
  { lat: 39.9042, lng: 116.4074, name: 'Beijing, China', country: 'China' },
  { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India', country: 'India' },
  { lat: -23.5505, lng: -46.6333, name: 'São Paulo, Brazil', country: 'Brazil' },
  { lat: 48.8566, lng: 2.3522, name: 'Paris, France', country: 'France' },
  { lat: -26.2041, lng: 28.0473, name: 'Johannesburg, RSA', country: 'South Africa' },
  { lat: 40.7128, lng: -74.0060, name: 'New York, USA', country: 'USA' },
  { lat: 31.2304, lng: 121.4737, name: 'Shanghai, China', country: 'China' }
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function createEvent() {
  const src = pick(locations);
  let dest = pick(locations);
  while (dest.name === src.name) {
    dest = pick(locations);
  }

  return {
    id: Date.now() + Math.random().toString(36).substring(2, 9),
    time: new Date().toISOString(),
    type: pick(types),
    srcIp: genIP(),
    destIp: genIP(),
    srcLoc: src,
    destLoc: dest,
    level: pick(['Low', 'Medium', 'High', 'Critical'])
  };
}

io.on('connection', (socket) => {
  console.log('user connected:', socket.id);

  const initial = Array.from({ length: 15 }, createEvent);
  socket.emit('initial_data', initial);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

setInterval(() => {
  const event = createEvent();
  io.emit('new_attack', event);
}, 800);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

