# +----------------------------------------------------------------------------------------+ #
# |  _____                                          _             _                        | #
# | |  __ \                                        | |           (_)                       | #
# | | |  | |   ___  __   __   ___    ___    _ __   | |_    __ _   _   _ __     ___   _ __  | #
# | | |  | |  / _ \ \ \ / /  / __|  / _ \  | '_ \  | __|  / _` | | | | '_ \   / _ \ | '__| | #
# | | |__| | |  __/  \ V /  | (__  | (_) | | | | | \ |_  | (_| | | | | | | | |  __/ | |    | #
# | |_____/   \___|   \_/    \___|  \___/  |_| |_|  \__|  \__,_| |_| |_| |_|  \___| |_|    | #
# |                                                                                        | #
# +----------------------------------------------------------------------------------------+ #

FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04 AS devcontainer
ARG USER_NAME=vscode
ARG GROUP_NAME=vscode

# ホスト側のファイル所有者とのUID衝突を避けるためユーザーを削除
RUN deluser ubuntu

# Install Node.js
RUN \
  --mount=type=cache,target=/var/lib/apt/lists \
  --mount=type=cache,target=/var/cache/apt/archives \
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
  apt-get install -y nodejs

COPY \
  --chown=${USER_NAME}:${GROUP_NAME} \
  --link \
  backend/package.json backend/pnpm-lock.yaml /workspaces/Frost/backend/

# Set working directory
WORKDIR /workspaces/Frost/backend/

# Enable pnpm
RUN corepack enable pnpm

# Switch user
USER ${USER_NAME}

# Install project dependencies (generate node_modules)
RUN --mount=type=cache,target=/vscode/.pnpm-store \
  pnpm install
