# Docker

## Production

```bash
docker build -t sentinelx .
docker compose up -d
```

## Development

```bash
docker compose -f docker-compose.dev.yml up
```

## Postgres profile

```bash
docker compose --profile postgres up
```

The app container reads `DATABASE_URL`. With SQLite (default) it mounts a
named volume at `/data`. With the `postgres` profile, point
`DATABASE_URL` to `postgresql://sentinelx:sentinelx@postgres:5432/sentinelx`
and set the env var in your shell.
