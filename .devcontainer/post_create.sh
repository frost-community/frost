#!/usr/bin/env bash

# Bash Strict Mode (http://redsymbol.net/articles/unofficial-bash-strict-mode/)
set -euo pipefail
IFS=$'\n\t'

# Constants
USER_NAME=vscode
GROUP_NAME=vscode
PROJECT_DIR=/workspaces/Frost
BE_NODE_MODULES_PATH="${PROJECT_DIR}/backend/node_modules"
FE_NODE_MODULES_PATH="${PROJECT_DIR}/frontend/node_modules"

# 生成されたnode_modulesの所有者を変更
if [ -d "$BE_NODE_MODULES_PATH" ]; then
  sudo chown "${USER_NAME}:${GROUP_NAME}" --recursive "$BE_NODE_MODULES_PATH"
fi

# 生成されたnode_modulesの所有者を変更
if [ -d "$FE_NODE_MODULES_PATH" ]; then
  sudo chown "${USER_NAME}:${GROUP_NAME}" --recursive "$FE_NODE_MODULES_PATH"
fi
