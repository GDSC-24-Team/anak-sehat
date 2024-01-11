exports.up = (pgm) => {
  pgm.createTable("children", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    fullname: {
      type: "TEXT",
      notNull: true,
    },
    birth_date: {
      type: "DATE",
      notNull: true,
    },
    age: {
      type: "INTEGER",
      notNull: true,
    },
    gender: {
      type: "VARCHAR(10)",
      notNull: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "children",
    "fk_children.user_id_users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("children", "fk_children.user_id_users.id");

  pgm.dropTable("children");
};
