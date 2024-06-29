FROM postgres:15 AS identity-db
ARG USERNAME=postgres

# Switch user
# この操作により権限が一般ユーザーになります。
USER $USERNAME
WORKDIR /home/$USERNAME/
