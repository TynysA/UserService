"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// Настройка подключения к базе данных PostgreSQL
const pool = new pg_1.Pool({
    user: "postgres",
    password: "Adai2003",
    host: "localhost",
    port: 5432,
    database: "uni",
});
const port = 3001;
// Эндпоинт для записи событий
app.post("/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventType, userId } = req.body;
        // Ваш код для записи события в базу данных
        yield pool.query("INSERT INTO events (event_type, user_id, time) VALUES ($1, $2, NOW()) RETURNING *", [eventType, userId]);
        return res.status(201).send("Событие записано.");
    }
    catch (error) {
        console.error("Ошибка при записи события:", error);
        return res.status(500).send("Произошла ошибка при записи события.");
    }
}));
// Эндпоинт для получение всех изменений
app.get("/history", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, page, limit } = req.query;
        // Преобразуйте параметры в числа, если нужно
        const userIdInt = userId ? parseInt(userId, 10) : null;
        const pageInt = page ? parseInt(page, 10) : 1;
        const limitInt = limit ? parseInt(limit, 10) : 10;
        // Ваш код для записи события в базу данных
        let query = "SELECT * FROM events";
        const values = [];
        if (userIdInt) {
            query += " WHERE user_id = $1";
            values.push(userIdInt);
        }
        // Рассчитайте оффсет
        const offset = (pageInt - 1) * limitInt;
        query += ` ORDER BY time DESC OFFSET $${values.length + 1} LIMIT $${values.length + 2}`;
        values.push(offset, limitInt);
        console.log(query);
        console.log(values);
        const result = yield pool.query(query, values);
        console.log(result);
        const history = result.rows;
        return res.status(200).json(history);
    }
    catch (error) {
        console.error("Ошибка при записи события:", error);
        return res.status(500).send("Произошла ошибка при записи события.");
    }
}));
// Эндпоинт для получение изменение с одиним id
app.listen(port, () => {
    console.log(`Сервис "Истории действий с пользователями" запущен на порту ${port}`);
});
