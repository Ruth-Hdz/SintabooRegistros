import express from "express";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";
import { pool } from "./database.js";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Crear carpeta uploads si no existe
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ---------------- Configuración Multer ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Formato de logo inválido. Solo PNG o JPG."));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB máximo
});

// ---------------- POST: Registrar tienda ----------------
app.post("/api/registro", upload.single("logo"), async (req, res) => {
  try {
    const {
      nombreCompleto,
      correo,
      contrasena,
      telefono,
      nombreTienda,
      descripcion,
      direccion,
      ciudadEstado,
      whatsapp,
      plan,
      metodosPago,
      envio,
      redes
    } = req.body;

    const logo = req.file ? req.file.filename : null;

    // Asegurar que los campos JSON se guarden correctamente
    const redesJSON = redes ? JSON.stringify(redes) : null;
    const metodosPagoJSON = metodosPago ? JSON.stringify(metodosPago) : null;
    const envioJSON = envio ? JSON.stringify(envio) : null;

    const [result] = await pool.query(
      `INSERT INTO registros 
      (nombre_completo, correo, contrasena, telefono, nombre_tienda, logo, descripcion, direccion, ciudad_estado, whatsapp, redes, plan, metodos_pago, envio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombreCompleto,
        correo,
        contrasena,
        telefono,
        nombreTienda,
        logo,
        descripcion,
        direccion,
        ciudadEstado,
        whatsapp,
        redesJSON,
        plan,
        metodosPagoJSON,
        envioJSON
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("❌ Error en /api/registro:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- GET: Obtener todas las tiendas ----------------
app.get("/api/registro", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM registros ORDER BY created_at DESC");
    res.json({ success: true, registros: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
