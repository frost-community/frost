# +----------------------------------------------------------------------------------------+ #
# |  _____                                          _             _                        | #
# | |  __ \                                        | |           (_)                       | #
# | | |  | |   ___  __   __   ___    ___    _ __   | |_    __ _   _   _ __     ___   _ __  | #
# | | |  | |  / _ \ \ \ / /  / __|  / _ \  | '_ \  | __|  / _` | | | | '_ \   / _ \ | '__| | #
# | | |__| | |  __/  \ V /  | (__  | (_) | | | | | \ |_  | (_| | | | | | | | |  __/ | |    | #
# | |_____/   \___|   \_/    \___|  \___/  |_| |_|  \__|  \__,_| |_| |_| |_|  \___| |_|    | #
# |                                                                                        | #
# +----------------------------------------------------------------------------------------+ #

# Node.js 20 image on Debian 12 (bookworm)
FROM node:20-bookworm AS devcontainer
ARG USERNAME=node

RUN apt-get update

# Install sudo
RUN apt-get install -y sudo
RUN echo "node ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/node

# Install ping
RUN apt-get install -y iputils-ping net-tools

# Install PostgreSQL
RUN apt-get install -y postgresql postgresql-contrib

# Install pnpm
RUN corepack enable pnpm

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/
