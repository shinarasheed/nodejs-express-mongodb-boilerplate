import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
// import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'colors';
import connectDB from './config/db';
import router from './routes/index';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//set secure http headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//100 request in 1 hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 10000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

//Bodyparser.  parse body data
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// app.use(mongoSanitize);

//Data sanitization against XSS
app.use(xss());

//prevent parameter pollution
app.use(hpp());

app.get('/', (req, res) => {
  res.send('API is running');
});

//api router
app.use('/api', router);

export default app;
