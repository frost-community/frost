# ------------------------------------------------- #
# base

# Node.js 20 image on Debian 12 (bookworm)
FROM node:20-bookworm AS base

# Install pnpm
RUN corepack enable pnpm


# ------------------------------------------------- #
# [target] server

FROM base AS server
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
# [target] server-db

FROM postgres:15 AS server-db
ARG USERNAME=postgres

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/

# ------------------------------------------------- #
# [target] identity-db

FROM postgres:15 AS identity-db
ARG USERNAME=postgres

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/
