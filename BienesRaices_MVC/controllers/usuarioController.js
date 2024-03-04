import {check,validationResult} from 'express-validator'
import Usuario from "../models/Usuario.js";
import{generarId} from "../helpers/token.js"
import{emailRegistro} from '../helpers/emails.js'

const formularioLogin=(req,res)=> {
    res.render('auth/login.pug',{
        pagina:'Iniciar sesion'
    });
}

const formularioRegistro=(req,res)=> {
    res.render('auth/registro.pug',{
        pagina:'Crear Cuenta'
    });
}

const registrar = async (req, res) => {
    const { nombre, email, password } = req.body; // Obtener nombre, email y password de req.body

    // Validaciones
    await check('nombre').notEmpty().withMessage('El Nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('No parece un email').run(req);
    await check('password').isLength({ min: 3 }).withMessage('La contraseña debe tener al menos 3 caracteres').run(req);
    await check('repetir_password').equals(password).withMessage('Las contraseñas no coinciden').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        // Errores
        return res.render('auth/registro', {
            pagina: "Crear Cuenta",
            errores: resultado.array(),
            usuario: {
                nombre,
                email
            }
        });
    }

    // Verificar usuario duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: "Crear Cuenta",
            errores: [{ msg: 'El usuario ya está registrado' }],
            usuario: {
                nombre,
                email
            }
        });
    }

    const usuario= await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    });

    //enviar email de confirmacion
    emailRegistro({
        nombre:usuario.nombre,
        email:usuario.email,
        token:usuario.token

    })


    //mostrar mensaje de confirmacion 
    res.render('templates/mensaje.pug', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmación a su correo, presiona el enlace'
    });
    
};


const confirmar = async(req,res) => {
    const {token} = req. params;
    //verificar si el token es valido
    const usuario = await Usuario.findOne({where:{token}})
    console.log(usuario)
    //if(!usuario){
        //return res.render('auth/confirmar-cuenta.pug'),{
        //pagina: 'Error al confirmar tu cuenta',
        //mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
        //error: true
        //}
    //}
}

const formulariorecuperarContrasena=(req,res)=> {
    res.render('auth/recuperarCuenta.pug',{
        pagina:'Recuperar Cuenta'
    });
}


export{
    formularioLogin,
    formularioRegistro,
    formulariorecuperarContrasena,
    registrar,
    confirmar
}