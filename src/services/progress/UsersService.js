const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({
    username,
    password,
    fullname,
    email,
    phone,
    address,
    gender,
  }) {
    // verify username, pastikan belum terdaftar
    await this.verifyNewUsername(username);

    // verify email, pastikan belum terdaftar
    await this.verifyNewEmail(email);

    // bila verifikasi lolos, maka masukkan username baru ke database
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      values: [
        id,
        username,
        hashedPassword,
        fullname,
        email,
        phone,
        address,
        gender,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user. Username sudah digunakan"
      );
    }
  }

  async verifyNewEmail(email) {
    const query = {
      text: "SELECT email FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError("Gagal menambahkan user. Email sudah digunakan");
    }
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id, username, fullname, email, phone, address, gender FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    return id;
  }

  async getUsersByUsername(username) {
    const query = {
      text: "SELECT id, username, fullname, email, phone, address, gender FROM users WHERE username LIKE $1",
      values: [`%${username}%`],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = UsersService;
