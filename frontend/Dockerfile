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

# まだホスト環境をマウントしていないため、このタイミングではpackage.jsonとpnpm-lock.yamlなどが存在しない

# やってること:
# 1. ローカルのpackage.jsonとpnpm-lock.yamlを、コンテナの/workspaces/Frost/frontend/にコピー
# 2. 作業ディレクトリを変更: /workspaces/Frost/frontend/
# 3. コピーしてきたpackage.jsonとpnpm-lock.yamlを使ってpnpm install、node_modulesを生成する。
#    node_modulesは所有者が違うため、post_createのタイミングでchownする。

# Copy: (local) frontend/package.json frontend/pnpm-lock.yaml to (container) /workspaces/Frost/frontend/
COPY \
  --chown=${USER_NAME}:${GROUP_NAME} \
  --link \
  frontend/package.json frontend/pnpm-lock.yaml /workspaces/Frost/frontend/

# Set working directory
WORKDIR /workspaces/Frost/frontend/

# Enable pnpm
RUN corepack enable pnpm

# Switch user
USER ${USER_NAME}

# Install project dependencies (generate node_modules)
RUN --mount=type=cache,target=/vscode/.pnpm-store \
  pnpm install
