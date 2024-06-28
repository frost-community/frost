# ------------------------------------------------- #
# base

# Node.js 20 image on Debian 12 (bookworm)
FROM node:20-bookworm AS base

# Install pnpm
RUN corepack enable pnpm


# ------------------------------------------------- #
# [target] backend

FROM base AS backend
ARG USERNAME=node

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/


# ------------------------------------------------- #
# [target] frontend

FROM base AS frontend
ARG USERNAME=node

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/


# ------------------------------------------------- #
# [target] db

FROM postgres:15 AS db
ARG USERNAME=postgres

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/
