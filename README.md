# mvp-backend

This backend is a simple first version of what EduVault server will offer, which is authentication and creating credentials to work with Textile ThreadDB.

## To run

change the example.env.local to .env.local

```bash
npm install
npm run build

# Make sure you have docker running on your system

# Only needs to be done once:
make setup
# Needs to run each time you add a new dependency:
make install
# Later you can just call this to start:
make dev
```

> server will be available on `localhost:<The port number you used in .env file>` eg. `localhost:3003`
