exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    username: {
      type: "VARCHAR(50)",
      unique: true,
      notNull: true,
    },
    password: {
      type: "TEXT",
      notNull: true,
    },
    fullname: {
      type: "TEXT",
      notNull: true,
    },
    email: {
      type: "VARCHAR(50)",
      unique: true,
      notNull: true,
    },
    phone: {
      type: "VARCHAR(13)",
      unique: true,
      notNull: true,
    },
    address: {
      type: "TEXT",
      notNull: true,
    },
    gender: {
      type: "VARCHAR(10)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
