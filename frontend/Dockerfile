
FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04 AS frontend

# ホスト側のファイル所有者とのUID衝突を避けるためユーザーを削除
RUN deluser ubuntu

# Install Node.js
RUN \
  --mount=type=cache,target=/var/lib/apt/lists \
  --mount=type=cache,target=/var/cache/apt/archives \
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
  apt-get install -y nodejs

# Install pnpm
RUN corepack enable pnpm
