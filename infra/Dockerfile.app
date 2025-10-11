FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
COPY tsconfig*.json ./

COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
COPY apps/pinger/ ./apps/pinger/
COPY apps/web/ ./apps/web/

RUN bun install

RUN bun run build

COPY infra/start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]
