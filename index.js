//importamos todas la librerias de express//

import express from 'express';

import dotenv from 'dotenv';
import { conectarDB, supabase } from './db/db.js';
dotenv.config();


//creamos la app de expres//

const app = express();

conectarDB();

//para leer el formato json//

app.use(express.json());

//creamos la ruta de inicio//
app.get('/', (req, res) => {
    res.send ({
        mensaje: "Bienvenido a mi API REST con express"
    });
    });  

    //ruta saludar //
    app.get("/saludo", (req, res) => {
        res.send({
            mensaje: "Bienvenido al curso de java script, aprediz🤍",
            hora:new Date().toLocaleTimeString()
        });
    });

    //ruta edad//

app.get("/completo", (req, res) => {
    res.send({
        mensaje: "nombre: jeylin vargas, edad: 18 años"+ "telefono: 321 456 7890"+ "correo: fierrojeylin@gamil.com"
    })
}); 


                        //ruta usuarios //


    app.get("/usuarios", async (req,res)=> {
        const { data, error } = await supabase
        .from("usuarios")
        .select("*");

        if (error){
            console.log("Error:", error);
            return res.status(500).json({ error })
        }
        console.log("Usuarios obtenidos:", data);

        res.json({
            total: data.length,
            usuarios: data
        });
    });


                     // ruta de crear usuarios a la base de datos //
    app.post("/crear", async(req,res)=>{
        const{nombre,apellido,telefono,correo,rol,activo}=req.body;


    //validar que los campos no esten vacios//
    if (!nombre || !apellido || !telefono || !correo || !rol || activo === undefined || activo === null){
            console.log("❌ ERROR: FALTAN CAMPOS POR LLENAR");
            return res.status(400).json({error:"FALTAN CAMPOS POR LLENAR"});
              }


    //insertamos los datos a la base de datos //
        const {data,error}=await supabase
        .from("usuarios")
        .insert([{nombre,apellido,telefono,correo,rol,activo}])
        .select();



    //validamos is hay error //
        if (error){
            console.error("Error:",error);
            return res.status(500).json({error});
             }


     //respuesta al cliente//
        res.json({
            mensaje:"🟢Usuario creado exitosamente",
            usuario:data[0]
        });
 
        })


                                    //ruta de actiualizar usuario a la base de datos //

        app.put("/usuarios/:id", async (req,res)=>{
            console.log ("💬BODY UPDATE:", req.body);

            const { id } = req.params;
            const { nombre, apellido, telefono, correo, rol, activo } = req.body;


            //validar id//

            if (!id){
                return res.status(400).json({ error: "⚠ Falta el Id"});
            }

            // validar que llegue al menos un dato//

           if ( nombre === undefined && apellido === undefined && telefono === undefined && correo === undefined && rol === undefined && activo === undefined
) {
  return res.status(400).json({ error: "no hay datos para actualizar" });
}
            // construir un objeto dinamico//

           const datosActualizar = {};

            if (nombre !== undefined) datosActualizar.nombre = nombre;
            if (apellido !== undefined) datosActualizar.apellido = apellido;
            if (telefono !== undefined) datosActualizar.telefono = telefono;
            if (correo !== undefined) datosActualizar.correo = correo;
            if (rol !== undefined) datosActualizar.rol = rol;
            if (activo !== undefined) datosActualizar.activo = activo;

            console.log ("💬Datos a actualizar:", datosActualizar);


            //actualizar en supabase//

            const { data, error } = await supabase
            .from("usuarios")
            .update(datosActualizar)
            .eq("id", id)
            .select();

            console.log("💥BD", data);
            console.log("⚠ Error", error);

            if (error){
                return res.status(500).json({ error });
             }
             
             if (!data || data.length === 0){
                return res.status(404).json({ error: "Usuario no encontrado" });
                }

                res.json({  
                    mensaje:"✔ Usuario actualizado",
                    usuario: data[0]    


                 });


        }  );
    
                                 // ruta de eliminar usuario en la base de datos//

        app.delete("/usuarios/:id", async (req,res)=>{

            const { id } = req.params;
            console.log ("🗑 Id a eliminar:", id);

            // validar id//
            if (!id){
                return res.status(400).json({ error: "⚠ Falta el Id"});
                 }

                 // eliminar en supa base//

                 const { data, error } = await supabase
                    .from("usuarios")
                    .delete()
                    .eq("id", id)
                    .select();

                    console.log("💥BD", data);
                    console.log("⚠ Error", error);

                    if (error){
                        return res.status(500).json({ error });
                    }
                      if (!data || data.length === 0){
                        return res.status(404).json({ error: "Usuario no encontrado" });
                    }

                    res.json({
                        mensaje:"✔ Usuario eliminado",
                        usuario: data[0]
                    });



            });





    //definimos el puerto donde se va a levantar el servidor//

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

