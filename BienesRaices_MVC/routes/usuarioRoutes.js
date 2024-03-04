import express from "express";
import { formularioLogin, formularioRegistro,formulariorecuperarContrasena, registrar, confirmar } from "../controllers/usuarioController.js";
const router = express.Router();

// Routes
router.get('/login', formularioLogin);
//----REGISTRO-------------------------------
router.get('/registro', formularioRegistro );
router.post('/registro', registrar );
//recuperar contrasena----------------
router.get('/recuperarContrasena', formulariorecuperarContrasena );

router.get('/confirmar', confirmar );

router.post('/nosotros', (req, res)=> {
    res.json('Estas en nosotros');
});

export default router;
