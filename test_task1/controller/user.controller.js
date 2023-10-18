const db = require("../db");
const axios = require("axios");
class UserController {
  async createUser(req, res) {
    const { name, surname } = req.body;
    const newPerson = await db.query(
      `INSERT INTO person (name, surname) VALUES($1, $2) RETURNING *`,
      [name, surname]
    );
    const personId = newPerson.rows[0].id;
    try {
      await axios.post("http://localhost:3001/events", {
        eventType: "user_created",
        userId: personId,
      });
    } catch (error) {
      console.error(
        "Ошибка при отправке события в историю действий:",
        error.message
      );
    }

    res.json(newPerson);
  }
  async getUsers(req, res) {
    const users = await db.query(`SELECT * FROM person`);
    res.json(users.rows);
  }
  async updateUser(req, res) {
    const { id, name, surname } = req.body;
    const user = await db.query(
      `UPDATE person set name = $1, surname = $2 WHERE id = $3 RETURNING *`,
      [name, surname, id]
    );

    try {
      await axios.post("http://localhost:3001/events", {
        eventType: "user_updated",
        userId: id,
      });
    } catch (error) {
      console.error(
        "Ошибка при отправке события в историю действий:",
        error.message
      );
    }

    res.json(user.rows[0]);
  }
}

module.exports = new UserController();
