#!/usr/bin/env bash

# +----------------------------------------------------------------------------------------+ #
# |  _____                                          _             _                        | #
# | |  __ \                                        | |           (_)                       | #
# | | |  | |   ___  __   __   ___    ___    _ __   | |_    __ _   _   _ __     ___   _ __  | #
# | | |  | |  / _ \ \ \ / /  / __|  / _ \  | '_ \  | __|  / _` | | | | '_ \   / _ \ | '__| | #
# | | |__| | |  __/  \ V /  | (__  | (_) | | | | | \ |_  | (_| | | | | | | | |  __/ | |    | #
# | |_____/   \___|   \_/    \___|  \___/  |_| |_|  \__|  \__,_| |_| |_| |_|  \___| |_|    | #
# |                                                                                        | #
# +----------------------------------------------------------------------------------------+ #

# Bash Strict Mode (http://redsymbol.net/articles/unofficial-bash-strict-mode/)
set -euo pipefail
IFS=$'\n\t'

# Constants
WORKSPACE_PATH=/workspaces
BACKEND_PACKAGE_PATH="${WORKSPACE_PATH}/backend"
FRONTEND_PACKAGE_PATH="${WORKSPACE_PATH}/frontend"

# 各パッケージの package.json を参照して pnpm と依存関係をインストールする
echo "Install backend dependencies..."
cd "$BACKEND_PACKAGE_PATH"
corepack pnpm install --frozen-lockfile

echo "Install frontend dependencies..."
cd "$FRONTEND_PACKAGE_PATH"
corepack pnpm install --frozen-lockfile