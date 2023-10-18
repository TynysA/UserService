import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";

const app = express();
app.use(bodyParser.json());

// Настройка подключения к базе данных PostgreSQL
const pool = new Pool({
  user: "postgres",
  password: "Adai2003",
  host: "localhost",
  port: 5432,
  database: "uni",
});

const port = 3001;

// Эндпоинт для записи событий
app.post("/events", async (req, res) => {
  try {
    const { eventType, userId } = req.body;

    // Ваш код для записи события в базу данных
    await pool.query(
      "INSERT INTO events (event_type, user_id, time) VALUES ($1, $2, NOW()) RETURNING *",
      [eventType, userId]
    );

    return res.status(201).send("Событие записано.");
  } catch (error) {
    console.error("Ошибка при записи события:", error);
    return res.status(500).send("Произошла ошибка при записи события.");
  }
});
// Эндпоинт для получение всех изменений
// http://localhost:3001/history?userId=123&page=2&limit=10
app.get("/history", async (req, res) => {
  try {

    const { userId, page, limit } = req.query;

    // Преобразуйте параметры в числа
    const userIdInt = userId ? parseInt(userId as string, 10) : null;
    const pageInt = page ? parseInt(page as string, 10) : 1;
    const limitInt = limit ? parseInt(limit as string, 10) : 10;
    // Код для записи события в базу данных
    let query = "SELECT * FROM events";
    const values: any[] = [];
    if (userIdInt) {
      query += " WHERE user_id = $1";
      values.push(userIdInt);
    }

    // Рассчитайте оффсет
    const offset = (pageInt - 1) * limitInt;
    query += ` ORDER BY time DESC OFFSET $${values.length + 1} LIMIT $${
      values.length + 2
    }`;
    values.push(offset, limitInt);
    console.log(query);
    console.log(values);

    const result = await pool.query(query, values);

    const history = result.rows;

    return res.status(200).json(history);
  } catch (error) {
    console.error("Ошибка при записи события:", error);
    return res.status(500).send("Произошла ошибка при записи события.");
  }
});
// Эндпоинт для получение изменение с одиним id

app.listen(port, () => {
  console.log(
    `Сервис "Истории действий с пользователями" запущен на порту ${port}`
  );
});
