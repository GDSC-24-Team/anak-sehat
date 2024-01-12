const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class ChildrenService {
  constructor() {
    this._pool = new Pool();

    this.addChild = this.addChild.bind(this);
    this.getChildrenByUserId = this.getChildrenByUserId.bind(this);
    this.deleteChildById = this.deleteChildById.bind(this);
  }

  async addChild({ fullname, birth_date, age, gender, user_id }) {
    const id = `child-${nanoid(16)}`;
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const query = {
      text: "INSERT INTO children VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      values: [
        id,
        fullname,
        birth_date,
        age,
        gender,
        user_id,
        created_at,
        updated_at,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Anak gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getChildrenByUserId(user_id) {
    const query = {
      text: "SELECT children.*, users.username FROM children LEFT JOIN users ON users.id = children.user_id WHERE children.user_id = $1",
      values: [user_id],
    };

    const result = await this._pool.query(query);

    // if (!result.rows.length) {
    // 	throw new NotFoundError('User dengan id tersebut tidak ditemukan')
    // }

    return result.rows;
  }

  async deleteChildById(id) {
    const query = {
      text: "DELETE FROM children WHERE id = $1",
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyChildParent(id, user_id) {
    const query = {
      text: "SELECT * FROM children WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Anak tidak ditemukan");
    }

    const child = result.rows[0];

    if (child.user_id !== user_id) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}

module.exports = ChildrenService;
