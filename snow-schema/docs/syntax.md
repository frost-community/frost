## 構文
```
syntax "snow1";

route "/api/me" {
  get {
    response Account;
  }
}

route "/api/users/:id" {
  parameter id {
    pattern UUID;
  }
  get {
    response User;
  }
}

alias UUID = pattern "([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})";
alias Users = model User[];

model Account {
  field accountId: string;
  field users: Users;
}

model User {
  field userId: string {
    pattern UUID;
    min 1;
  }
  field name: string {
    pattern "[A-Za-z0-9-]*";
    min 1;
  }
  field displayName: string {
    min 1;
  }
}

```
