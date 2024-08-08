# 初始镜像，用于编译
FROM 192.168.0.212:5000/baseimgs/node:18.20.3-slim AS deps
WORKDIR /app

ENV NODE_ENV production


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY ./public ./public

COPY --chown=nextjs:nodejs .next/standalone ./

COPY --chown=nextjs:nodejs .next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME 0.0.0.0


CMD ["node","server.js"]