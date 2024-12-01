// server.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(cors());

// Endpoint para autenticación con Marketing Cloud
app.post('/auth', async (req, res) => {
  try {
    const response = await axios.post('https://YOUR_SUBDOMAIN.auth.marketingcloudapis.com/v2/token', {
      grant_type: 'client_credentials',
      client_id: process.env.MC_CLIENT_ID,
      client_secret: process.env.MC_CLIENT_SECRET,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener el token:', error);
    res.status(500).json({ error: 'Error al obtener el token' });
  }
});

// Otros endpoints para interactuar con Data Extensions
app.get('/data-extension/:id', async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization;

  try {
    const response = await axios.get(`https://mc1-y847vx6hhqvmtnnxy67y87b1.rest.marketingcloudapis.com/data/v1/customobjectdata/key/${id}/rowset`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
