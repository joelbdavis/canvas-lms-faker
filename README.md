# Canvas LMS Faker

Generate fake users and courses in Canvas LMS via API.

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

### CLI Options

- `--users` or `-u`: Number of fake users to create (default: 5)
- `--courses` or `-c`: Number of fake courses to create (default: 2)
- `--enrollment-probability` or `-p`: Probability (0-1) of a student being enrolled in a course (default: 0.3)
- `--cleanup`: Delete all data created by this script
- `--dry-run`: Show what would be deleted without actually deleting (use with --cleanup)

### Examples

Create users and courses:

```sh
# Create 10 users and 5 courses
node src/index.js -u 10 -c 5

# Create 10 users, 5 courses, with 50% enrollment probability
node src/index.js -u 10 -c 5 -p 0.5
```

Cleanup data:

```sh
# See what would be deleted
node src/index.js --cleanup --dry-run

# Delete all created data (with confirmation prompt)
node src/index.js --cleanup
```

### Environment Variables

Create a `.env` file with the following variables:

```
CANVAS_URL=https://your-canvas-instance/api/v1
CANVAS_TOKEN=your_admin_token
```

## Features

- Generate realistic high school courses with proper naming conventions
- Create users with realistic names and email addresses
- Randomly enroll students in courses
- Safe cleanup of created data with confirmation
- Dry-run mode to preview changes

## Development

### Running Tests

```sh
npm test
```

### Project Structure

- `src/index.js`: Main script and CLI interface
- `src/canvasApi.js`: Canvas API integration
- `src/fakeData.js`: Fake data generation
- `src/*.test.js`: Test files

## Safety Features

- All created resources are tagged for easy identification
- Cleanup requires explicit confirmation
- Dry-run mode available to preview changes
- Only deletes resources created by this script
