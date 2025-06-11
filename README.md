# Canvas LMS Faker

A Node.js utility to generate realistic fake data (users, courses, etc.) in a Canvas LMS instance using the Canvas API.

## Requirements

- Node.js
- Canvas LMS instance and admin API token

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your Canvas API URL and token.

## Usage

Run the script with optional CLI arguments:

```sh
node src/index.js --users 10 --courses 5
```

- `--users` or `-u`: Number of fake users to create (default: 5)
- `--courses` or `-c`: Number of fake courses to create (default: 2)

You can also use the short options:

```sh
node src/index.js -u 3 -c 2
```

### Environment Variables

Create a `.env` file with the following variables:

```
CANVAS_URL=https://your-canvas-instance/api/v1
CANVAS_TOKEN=your_admin_token
```

### Example

```
node src/index.js --users 8 --courses 4
```

This will create 8 users and 4 courses in your Canvas instance.

## Features

- Create fake users with realistic names and emails
- Create fake courses with realistic names and codes
- Easily extendable to enrollments, assignments, grades, etc.

## Configuration

`.env` file options:
