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


    //definimos el puerto donde se va a levantar el servidor//

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

