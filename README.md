# Vehicle Telematics - Setup & Run Guide

This project consists of two parts:
- **Client**: React + Vite frontend
- **Server**: Node.js + Express backend

## Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

## Installation

### 1. Install Client Dependencies
Navigate to the client folder and install dependencies:
```bash
cd client
npm install
```

### 2. Install Server Dependencies
Navigate to the server folder and install dependencies:
```bash
cd server
npm install
```

## Running the Project

### Option 1: Run Client

From the client directory, run:
```bash
cd client
npm run dev
```

The client will start on **http://localhost:5173** (default Vite port)

### Option 2: Run Server

#### Start the Server
```bash
cd server
npm run dev
```
The server will start on **http://localhost:8000** 

## Troubleshooting

If you encounter any issues:
1. Make sure all dependencies are installed: `npm install` in both client and server folders
2. Check that ports 5173 (client) and 3000 (server) are not in use
3. Ensure Node.js and npm are properly installed: `node --version` and `npm --version`

## API Integration

The client communicates with the server through API calls. Ensure the server is running before starting the client to avoid connection errors.
