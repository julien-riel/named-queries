db = db.getSiblingDB('named-queries');

db.createUser({
  user: 'api',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'named-queries'
    }
  ]
});

db.namedqueries.createIndex({ name: 1 }, { unique: true });
db.namedqueries.createIndex({ tags: 1 });
db.namedqueries.createIndex({ categories: 1 });

print('MongoDB initialized successfully');