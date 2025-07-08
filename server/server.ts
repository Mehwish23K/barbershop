import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';

// Types
interface Appointment {
  id: number;
  stylist: string;
  service: string;
  date: string;
  time: string;
  email: string;
  created_at: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface CreateAppointmentRequest {
  stylist: string;
  service: string;
  date: string;
  time: string;
  email: string;
}

interface UpdateAppointmentRequest {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface SocketEvents {
  join_admin: () => void;
  new_appointment: (appointment: Appointment) => void;
  appointment_updated: (data: { id: number; status: string }) => void;
  appointment_deleted: (data: { id: number }) => void;
}

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
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
app.get('/api/appointments', (req: Request, res: Response) => {
  db.all('SELECT * FROM appointments ORDER BY created_at DESC', (err: Error | null, rows: any[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ appointments: rows });
  });
});

// Create new appointment
app.post('/api/appointments', (req: Request<{}, any, CreateAppointmentRequest>, res: Response) => {
  const { stylist, service, date, time, email } = req.body;
  
  if (!stylist || !service || !date || !time || !email) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  
  const sql = `INSERT INTO appointments (stylist, service, date, time, email) 
               VALUES (?, ?, ?, ?, ?)`;
  
  db.run(sql, [stylist, service, date, time, email], function(this: sqlite3.RunResult, err: Error | null) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const newAppointment: Partial<Appointment> = {
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
app.put('/api/appointments/:id', (req: Request<{ id: string }, any, UpdateAppointmentRequest>, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const sql = `UPDATE appointments SET status = ? WHERE id = ?`;
  
  db.run(sql, [status, id], function(this: sqlite3.RunResult, err: Error | null) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    
    // Emit to admin room for real-time updates
    io.to('admin').emit('appointment_updated', { id: parseInt(id), status });
    
    res.json({ success: true, message: 'Appointment updated successfully' });
  });
});

// Delete appointment
app.delete('/api/appointments/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  
  const sql = `DELETE FROM appointments WHERE id = ?`;
  
  db.run(sql, id, function(this: sqlite3.RunResult, err: Error | null) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    
    // Emit to admin room for real-time updates
    io.to('admin').emit('appointment_deleted', { id: parseInt(id) });
    
    res.json({ success: true, message: 'Appointment deleted successfully' });
  });
});

// Get appointment statistics
app.get('/api/stats', (req: Request, res: Response) => {
  const queries = {
    total: 'SELECT COUNT(*) as count FROM appointments',
    pending: 'SELECT COUNT(*) as count FROM appointments WHERE status = "pending"',
    confirmed: 'SELECT COUNT(*) as count FROM appointments WHERE status = "confirmed"',
    completed: 'SELECT COUNT(*) as count FROM appointments WHERE status = "completed"'
  };
  
  const stats: Record<string, number> = {};
  let completed = 0;
  const total = Object.keys(queries).length;
  
  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, (err: Error | null, row: any) => {
      if (!err && row) {
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
  db.close((err: Error | null) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});