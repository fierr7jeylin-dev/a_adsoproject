import { Router } from 'express';
//importacion corregida con llaves
import { usuarios, crearUsuario } from '../controllers/usuarios.js'


const router = Router();

router.get('/', usuarios);
router.post('/crear', crearUsuario);


export default router;