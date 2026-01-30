# College Gate Pass System

A complete gate pass management system with QR code generation and scanning.

## Features
- 🎓 Student portal - Request gate passes and view QR codes
- 👨‍💼 HOD dashboard - Approve pending requests
- 🛡️ Watchman scanner - Camera-based QR scanning for exit

## Tech Stack
- Node.js + Express.js
- MySQL database
- JWT authentication
- QR code generation (qrcode + uuid)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   PORT=3000
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=gatepass
   JWT_SECRET=your_secret_key
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/register | POST | Register new user |
| /api/auth/login | POST | Login and get JWT |
| /api/gatepass/request | POST | Request gate pass |
| /api/gatepass/my-passes | GET | Get student's passes |
| /api/gatepass/pending | GET | Get pending requests (HOD) |
| /api/gatepass/approve/:id | POST | Approve gate pass (HOD) |
| /api/gatepass/exit | POST | Process exit (Watchman) |

## Frontend Pages

- `/` - Launcher with all portals
- `/register.html` - Student registration
- `/student.html` - Student dashboard
- `/hod.html` - HOD approval dashboard
- `/scanner.html` - Watchman QR scanner
