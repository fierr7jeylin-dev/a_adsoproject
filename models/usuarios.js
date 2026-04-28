import { supabase } from "../db/db.js";

//
export const UsuarioModel={ 
obtenerTodos: async () => {
    const { data, error }= await supabase
    .from ("usuarios")
    .select("*");

    return { data, error };
}
 };


// crear el usuario 
export const crearUser =async (nombre, apellido, telefono, correo, rol, activo)=>{
    const { data , error }= await supabase
    .from ('usuarios')
    .insert([{ nombre,apellido,telefono,correo,rol,activo}])
    .select();
  return { data, error };

};

 