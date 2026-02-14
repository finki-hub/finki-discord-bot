# FINKI Hub Discord Bot

Discord bot for the [`FINKI Hub`](https://discord.gg/finki-studenti-810997107376914444) Discord server, powered by [discord.js](https://github.com/discordjs/discord.js) 14. Requires Node.js. It is recommended to use the latest LTS version.

## Quick Setup (Production)

If you would like to just run the bot:

1. Download [`compose.prod.yaml`](./compose.prod.yaml)
2. Run `docker compose -f compose.prod.yaml up -d`

This Docker image is available as [ghcr.io/finki-hub/discord-bot](https://github.com/finki-hub/discord-bot/pkgs/container/discord-bot).

## Quick Setup (Development)

1. Clone the repository: `git clone https://github.com/finki-hub/discord-bot.git`
2. Install dependencies: `npm i`
3. Prepare env. variables by copying `env.sample` to `.env` - minimum setup requires `TOKEN` and `APPLICATION_ID`
4. Build the project in Docker: `docker compose build`
5. Run it: `docker compose up -d`

There is also a dev container available. To use it, just clone the repository, define the env. variables and open the container. Your development environment will be prepared automatically.

## Setup Without Docker

1. Clone the repository: `git clone https://github.com/finki-hub/discord-bot.git`
2. Install dependencies: `npm i`
3. Prepare env. variables by copying `env.sample` to `.env` - minimum setup requires `TOKEN` and `APPLICATION_ID`
4. Build the project: `npm run build`
5. Run it: `npm run start:env` or `npm run dev` (for hot reloading)

## Configuration

### Environment

The env. variables are stored in `.env.sample`. Only the `TOKEN` and `APPLICATION_ID` variables are required (for logging in to Discord). The `DATA_STORAGE_URL` variable is optional - if not set, data loading features will be disabled.

### Bot Configuration

The bot configuration is stored in `config/bot.json`. This file uses a multi-guild structure where each guild ID maps to its own configuration:

```json
{
  "GUILD_ID_1": {
    "channels": { ... },
    "crossposting": { ... },
    "errorWebhook": "https://...",
    "models": { ... },
    "roles": { ... },
    "ticketing": { ... }
  },
  "GUILD_ID_2": { ... }
}
```

When the bot joins a new guild, it automatically initializes a default configuration for that guild. You can use the `/config` commands to view and modify the configuration. The `/config data` subcommand allows you to manually trigger a reload of all data from the data storage.

See [`config/bot.json.example`](./config/bot.json.example) for an example configuration structure.

### Data Files

The data for the informational commands is loaded from data storage (if `DATA_STORAGE_URL` is configured). The following files are expected to be available at the data storage base URL:

1. `courses.json` - a consolidated array of all courses with their information, participants, prerequisites, and staff
2. `rooms.json` - an array of all the classrooms
3. `sessions.json` - an object of all exam sessions
4. `staff.json` - an array of the staff
5. `anto.json` - an array of strings containing Anto quotes

If `DATA_STORAGE_URL` is not configured, these features will be disabled and the bot will run without data loading functionality.

### Sessions (Timetables)

All the session schedule files should be placed in the `sessions` folder in your data storage bucket. The names of the files should match the respective names in `sessions.json`. When users request a session via the `/session` command, the bot will provide a direct link to the file in the data storage bucket.

## Integration With `finki-chat-bot`

This project features integration with [`finki-chat-bot`](https://github.com/finki-hub/finki-chat-bot) for enabling the FAQ and links functionality. The Discord bot fetches and mutates data from the chat bot using REST endpoints. If they are deployed in Docker, they should be on the same network to be able to communicate.

Please set the `CHATBOT_URL` env. variable to the URL of the chat bot.

### Data Storage Integration

The bot can load data files from a data storage service. Set the `DATA_STORAGE_URL` environment variable to the base URL of your data storage (without trailing slash). The bot will automatically fetch and periodically reload the following files:

- `courses.json` - Course information, participants, prerequisites, and staff
- `rooms.json` - Classroom information
- `sessions.json` - Exam session mappings (maps session names to filenames)
- `staff.json` - Staff member information
- `anto.json` - Array of Anto quotes (strings)

Session timetable files should be placed in the `sessions` folder in your data storage bucket. The filenames must match the values in `sessions.json`.

If `DATA_STORAGE_URL` is not set, the bot will start successfully but data-dependent features will be disabled. You can manually trigger a data reload using the `/config data` command.

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
