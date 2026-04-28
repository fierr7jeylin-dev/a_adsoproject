import { UsuarioModel,crearUser} from '../models/usuarios.js';

export const usuarios = async (req,res) => {
    //aqui recibes lo que el modelo envio con el "return"
    const { data, error } = await UsuarioModel.obtenerTodos();

    console.log ("DATA:", data);
    console.log("ERROR:", error);

    if (error){
        return res.status (500).json({ error });
    }
    return res.status(200).json({ data })
};

// crear usuarios 

export const crearUsuario = async (req,res) => {
    const { nombre,apellido,telefono,correo,rol,activo} = req.body;

// validacion rápida
    if (!nombre || !apellido || !telefono || !correo || !rol || activo === undefined ){
        return res.status(400).json ({ mensaje: "Faltan datos"});
    }
// llamamos a la funcion del modelo
    const { data, error }= await crearUser(nombre, apellido, telefono, correo, rol, activo);

    if (error) {
        return res.status(400).json({
            mensaje: "No se pudo crear el usuario",
            error: error.message
        });
    }



}