# FINKI Discord Bot

Discord bot for the [`FCSE Students`](https://discord.gg/finki-studenti-810997107376914444) Discord server, powered by [discord.js](https://github.com/discordjs/discord.js) 14. Requires Node.js. It is recommended to use the latest LTS version.

## Quick Setup (Production)

If you would like to just run the bot:

1. Download [`compose.prod.yaml`](./compose.prod.yaml)
2. Run `docker compose -f compose.prod.yaml up -d`

This Docker image is available as [ghcr.io/finki-hub/finki-discord-bot](https://github.com/finki-hub/finki-discord-bot/pkgs/container/finki-discord-bot).

## Quick Setup (Development)

1. Clone the repository: `git clone https://github.com/finki-hub/finki-discord-bot.git`
2. Install dependencies: `npm i`
3. Prepare env. variables by copying `env.sample` to `.env` - minimum setup requires `BOT_TOKEN` and `APPLICATION_ID`
4. Build the project in Docker: `docker compose build`
5. Run it: `docker compose up -d`

There is also a dev container available. To use it, just clone the repository, define the env. variables and open the container. Your development environment will be prepared automatically.

## Setup Without Docker

1. Clone the repository: `git clone https://github.com/finki-hub/finki-discord-bot.git`
2. Install dependencies: `npm i`
3. Prepare env. variables by copying `env.sample` to `.env` - minimum setup requires `BOT_TOKEN` and `APPLICATION_ID`
4. Build the project: `npm run build`
5. Run it: `npm run start:env` or `npm run dev` (for hot reloading)

## Configuration

### Environment

The env. variables are stored in `.env.sample`. Only the `BOT_TOKEN` and `APPLICATION_ID` variables are required (for logging in to Discord).

### Files

The data for the informational commands is stored in these files. It is not required to configure them. Here is a list of all files:

1. `classrooms.json` - an array of all the classrooms
2. `courses.json` - an array of the names of all courses
3. `information.json` - an array of all the course information
4. `participants.json` - an array of all courses and their number of participants
5. `prerequisites.json` - an array of course prerequisites
6. `professors.json` - an array of all courses and their professors and assistants
7. `roles.json` - roles for the scripts and for the embeds
8. `sessions.json` - an object of all exam sessions
9. `staff.json` - an array of the staff

### Sessions (Timetables)

All the session schedule files should be placed in the `sessions` folder. The names of the files should match the respective names in `sessions.json`.

## Integration With `finki-chat-bot`

This project features integration with [`finki-chat-bot`](https://github.com/finki-hub/finki-chat-bot) for enabling the FAQ and links functionality. The Discord bot fetches and mutates data from the chat bot using REST endpoints. If they are deployed in Docker, they should be on the same network to be able to communicate.

Please set the `CHATBOT_URL` env. variable to the URL of the chat bot.

## Frequently Asked Questions

1. The hot reloading is too slow
   - This is a Discord limitation because the bot has to relogin each time
2. How do I create a Discord bot?
   - Refer to <https://discord.com/developers/applications>

## Frequently Encountered Errors

1. "Error: Used disallowed intents"
   - You must enable all intents in the Discord Developer Portal
2. "Error \[TokenInvalid]: An invalid token was provided."
   - Your bot token is invalid.

## License

This project is licensed under the terms of the MIT license.
