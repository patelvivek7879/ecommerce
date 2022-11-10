FROM node:16-alpine AS deps
RUN apk add --no-cache  libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16-alpine AS builder

WORKDIR /app

# COPY --from=deps /apps/node_modules ./node_modules

COPY . .
RUN yarn run build

FROM node:16-alpine AS runner
WORKDIR /app


ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=bloguser:bloggroup /app/.next/standalone ./
COPY --from=builder --chown=bloguser:bloggroup /app/.next/static ./.next/static

USER bloguser
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
