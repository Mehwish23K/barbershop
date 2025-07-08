const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'barbershop.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stylist TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending'
  )`);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
  // Join admin room for real-time updates
  socket.on('join_admin', () => {
    socket.join('admin');
    console.log('Admin joined room');
  });
});

// API Routes

// Get all appointments
app.get('/api/appointments', (req, res) => {
  db.all('SELECT * FROM appointments ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ appointments: rows });
  });
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
  const { stylist, service, date, time, email } = req.body;
  
  if (!stylist || !service || !date || !time || !email) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  
  const sql = `INSERT INTO appointments (stylist, service, date, time, email) 
               VALUES (?, ?, ?, ?, ?)`;
  
  db.run(sql, [stylist, service, date, time, email], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const newAppointment = {
      id: this.lastID,
      stylist,
      service,
      date,
      time,
      email,
      status: 'pending'
    };
    
    // Emit to admin room for real-time updates
    io.to('admin').emit('new_appointment', newAppointment);
    
    res.json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
  });
});

// Update appointment status
app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const sql = `UPDATE appointments SET status = ? WHERE id = ?`;
  
  db.run(sql, [status, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    
    // Emit to admin room for real-time updates
    io.to('admin').emit('appointment_updated', { id, status });
    
    res.json({ success: true, message: 'Appointment updated successfully' });
  });
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = `DELETE FROM appointments WHERE id = ?`;
  
  db.run(sql, id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    
    // Emit to admin room for real-time updates
    io.to('admin').emit('appointment_deleted', { id });
    
    res.json({ success: true, message: 'Appointment deleted successfully' });
  });
});

// Get appointment statistics
app.get('/api/stats', (req, res) => {
  const queries = {
    total: 'SELECT COUNT(*) as count FROM appointments',
    pending: 'SELECT COUNT(*) as count FROM appointments WHERE status = "pending"',
    confirmed: 'SELECT COUNT(*) as count FROM appointments WHERE status = "confirmed"',
    completed: 'SELECT COUNT(*) as count FROM appointments WHERE status = "completed"'
  };
  
  const stats = {};
  let completed = 0;
  const total = Object.keys(queries).length;
  
  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, (err, row) => {
      if (!err) {
        stats[key] = row.count;
      }
      completed++;
      
      if (completed === total) {
        res.json(stats);
      }
    });
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});