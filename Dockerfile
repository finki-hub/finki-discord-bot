FROM --platform=${BUILDPLATFORM} node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm run generate

COPY . ./
RUN npm run build

FROM node:24-alpine AS final
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./
COPY --from=build /app/dist ./dist

CMD [ "sh", "-c", "npx prisma migrate deploy && node dist/index.js" ]
