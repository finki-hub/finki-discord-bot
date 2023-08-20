# FINKI Discord Bot

Discord bot for the [`FINKI Students`](https://discord.gg/finki-studenti-810997107376914444) Discord server, powered by [discord.js](https://github.com/discordjs/discord.js) 14. Requires Node.js ≥ 18 and PostgreSQL.

It's recommended, but not required to run this inside a Docker container.

## Installation

### Installation (Docker)

1. Clone the repository: `git clone git@github.com:Delemangi/finki-discord-bot.git`
2. Build the images: `docker compose build [--build-arg PLATFORM=...]`

### Installation (Normal)

1. Clone the repository: `git clone git@github.com:Delemangi/finki-discord-bot.git`
2. Install the dependencies: `npm i`
3. Build the project: `npm run build`

## Running

### Running (Docker)

`docker compose up`

### Running (Normal)

`npm run start:prod`

## Configuration

### Basic configuration

1. Create a `.env` file in the root directory containing the environment variables as specified in the `.env.sample` file in the repository
2. Create a `config` folder in the root directory containing:
    1. `anto.json` - an array of all Anto quotes
    2. `classrooms.json` - an array of all the classrooms
    3. `courses.json` - an array of the names of all courses
    4. `information.json` - an array of all the course information
    5. `links.json` - an array of links for the `link` command
    6. `participants.json` - an array of all courses and their number of participants
    7. `prerequisites.json` - an array of course prerequisites
    8. `professors.json` - an array of all courses and their professors and assistants
    9. `quiz.json` - an array of the quiz questions
    10. `responses.json` - an array of command responses
    11. `roles.json` - roles for the scripts and for the embeds
    12. `rules.json` - an array of the server rules
    13. `sessions.json` - an object of all exam sessions
    14. `staff.json` - an array of the staff

### Sessions

Create a `sessions` folder in the root directory. All the session schedule files should go there. The files names should match the respective names in the `sessions.json` config file.

## Logging

The bot logs `info` and above messages in the console, and logs `debug` and above messages in `bot.log`, which gets wiped on every bot restart.
