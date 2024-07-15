## 構文
```
syntax "snow1";

type UUID = string {
  pattern "([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})";
};

type Name = string {
  pattern "[A-Za-z0-9-]*";
  min 1;
};

type DisplayName = string {
  min 1;
};

type Account = object {
  accountId: UUID;
  name: Name;
  users: User[];
};

type User = object {
  userId: UUID;
  name: Name;
  displayName: DisplayName;
}

GET /api/me {
  response Account;
}

POST /api/users {
  body {
    name: Name;
    displayName: DisplayName;
  }
  response User;
}

GET /api/users/:id {
  parameter id: UUID;
  response User;
}

DELETE /api/users/:id {
  parameter id: UUID;
}
```
