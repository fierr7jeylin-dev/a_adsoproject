//importamos todas la librerias de express//

import express from 'express';

import dotenv from 'dotenv';
import { conectarDB, supabase } from './db/db.js';
import  usuariosRouter  from './routes/usuarios.js'
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


  app.use("/usuarios", usuariosRouter);  
















                     // ruta de crear usuarios a la base de datos //
 














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



//----------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------------------------------//


                            // ruta pedidos //

            
            app.post("/api/pedidos", async (req, res) => {
  const { descripcion, cantidad, total, id, fecha_pedido } = req.body;

  // validar campos
  if (!descripcion || !cantidad || !total || !id || !fecha_pedido) {
    console.log("❌ ERROR: FALTAN CAMPOS POR LLENAR");
    return res.status(400).json({ error: "FALTAN CAMPOS POR LLENAR" });
  }

  // insertar en la tabla pedidos (NO en usuarios)
  const { data, error } = await supabase
    .from("pedidos")
    .insert([{ descripcion, cantidad, total, id, fecha_pedido }])
    .select();

  if (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json({
    mensaje: "🟢 Pedido registrado exitosamente",
    pedido: data[0],
  });
});

   // RUTA BUSCAR PODIDOS //


 app.get("/buscarpe/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("pedidos")
    .select(`
      descripcion,
      cantidad,
      total,
      fecha_pedido,
      usuarios (
        nombre,
        apellido,
        telefono,
        correo
      )
    `);

  if (error) {
    console.log("Error:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json({
    total: data.length,
    pedidos: data
  });
});





   // actualuzar pedidos //
 
  
app.put('/actualizar/:id', async (req, res) => { 

    console.log("💬 BODY UPDATE:", req.body);

   
    const { id: id_url } = req.params; 
    const { descripcion, cantidad, total, fecha_pedido } = req.body;

   
    if (!id_url) {
        return res.status(400).json({ error: "⚠ Faltan el ID en la URL" });
    }

  
    if (descripcion === undefined && cantidad === undefined && total === undefined && fecha_pedido === undefined) {
        return res.status(400).json({ error: "no hay datos para actualizar" });
    }

    
    const datosActualizar = {};
    if (descripcion !== undefined) datosActualizar.descripcion = descripcion;
    if (cantidad !== undefined) datosActualizar.cantidad = cantidad;
    if (total !== undefined) datosActualizar.total = total;
    if (fecha_pedido !== undefined) datosActualizar.fecha_pedido = fecha_pedido;

    console.log("💬 Datos a actualizar:", datosActualizar);

   
    const { data, error } = await supabase
        .from("pedidos")
        .update(datosActualizar)
        .eq("id_pedido", id_url) 
        .select();

    if (error) {
        console.error("⚠ Error Supabase:", error);
        return res.status(500).json({ error });
    }
    
    if (!data || data.length === 0) {
        return res.status(404).json({ error: "pedido no encontrado" });
    }

    res.json({  
        mensaje: "✔ Pedido actualizado",
        pedido: data[0]    
    });
});


// ruta eliminar pedidos //

 app.delete("/eliminarpe/:id", async (req,res)=>{

            const { id } = req.params;
            console.log ("🗑 Pedido a eliminar:", id);

            // validar id//
            if (!id){
                return res.status(400).json({ error: "⚠ Falta el Id pedido"});
                 }

                 // eliminar en supa base//

                 const { data, error } = await supabase
                    .from("pedidos")
                    .delete()
                    .eq("id_pedido", id)
                    .select();

                    console.log("💥BD", data);
                    console.log("⚠ Error", error);

                    if (error){
                        return res.status(500).json({ error });
                    }
                      if (!data || data.length === 0){
                        return res.status(404).json({ error: "Pedido no encontrado" });
                    }

                    res.json({
                        mensaje:"✔ Pedido eliminado",
                        pedido: data[0]
                    });
            });

 //--------------------------------------------------------------------------------------------------------------//
 //--------------------------------------------------------------------------------------------------------------//
                                    










    //definimos el puerto donde se va a levantar el servidor//

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

