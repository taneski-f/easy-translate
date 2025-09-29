import express from 'express';
import cors from 'cors';
import router from './routes.js';
import { config } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

const PORT = config.port;
app.listen(PORT, () => {
	console.log(`BE started at http://localhost:${PORT}`);
});
