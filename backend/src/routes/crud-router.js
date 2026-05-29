const express = require('express');

const pool = require('../db/pool');
const asyncHandler = require('../middleware/async-handler');

const fieldName = (field) => (typeof field === 'string' ? field : field.name);
const isNumericId = (id) => /^\d+$/.test(String(id));

const fieldValue = (field, body, mode) => {
  const name = fieldName(field);
  const rawValue = body[name];

  if (typeof field === 'string') {
    return rawValue;
  }

  if (
    rawValue === undefined &&
    mode === 'create' &&
    Object.prototype.hasOwnProperty.call(field, 'defaultValue')
  ) {
    return typeof field.defaultValue === 'function' ? field.defaultValue() : field.defaultValue;
  }

  return field.transform ? field.transform(rawValue, body, mode) : rawValue;
};

const createCrudRouter = ({ table, fields, orderBy, getById = false }) => {
  const router = express.Router();
  const names = fields.map(fieldName);
  const listOrder = orderBy ? ` ORDER BY ${orderBy}` : '';

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const result = await pool.query(`SELECT * FROM ${table}${listOrder}`);
      res.json(result.rows);
    })
  );

  if (getById) {
    router.get(
      '/:id',
      asyncHandler(async (req, res) => {
        if (!isNumericId(req.params.id)) {
          return res.status(404).json({ error: `${table} introuvable` });
        }

        const result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [req.params.id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ error: `${table} introuvable` });
        }
        return res.json(result.rows[0]);
      })
    );
  }

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const placeholders = names.map((_, index) => `$${index + 1}`).join(', ');
      const values = fields.map((field) => fieldValue(field, req.body, 'create'));
      const result = await pool.query(
        `INSERT INTO ${table} (${names.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      res.json(result.rows[0]);
    })
  );

  router.put(
    '/:id',
    asyncHandler(async (req, res) => {
      if (!isNumericId(req.params.id)) {
        return res.status(404).json({ error: `${table} introuvable` });
      }

      const setClause = names.map((name, index) => `${name} = $${index + 1}`).join(', ');
      const values = fields.map((field) => fieldValue(field, req.body, 'update'));
      const result = await pool.query(
        `UPDATE ${table} SET ${setClause} WHERE id = $${names.length + 1} RETURNING *`,
        [...values, req.params.id]
      );
      res.json(result.rows[0]);
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      if (!isNumericId(req.params.id)) {
        return res.status(404).json({ error: `${table} introuvable` });
      }

      await pool.query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
      res.json({ message: 'Deleted' });
    })
  );

  return router;
};

module.exports = createCrudRouter;
