import express from 'express';
import { db } from '../database.js';

const router = express.Router();

router.post('/', (req, res) => {
  const data = req.body;

  const query = `
    INSERT INTO registros
    (nombre_completo, correo, contrasena, telefono, nombre_tienda, descripcion, direccion, ciudad_estado, whatsapp, redes, plan, metodos_pago, envio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.nombreCompleto,
    data.correo,
    data.contrasena,
    data.telefono,
    data.nombreTienda,
    data.descripcion,
    data.direccion,
    data.ciudadEstado,
    data.whatsapp,
    JSON.stringify(data.redes || []),
    data.plan,
    data.metodosPago,
    data.envio
  ];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Registro guardado correctamente', id: result.insertId });
  });
});

export default router;
