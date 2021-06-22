import 'colors';

import app from './app';

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () =>
  console.log(
    `App started in ${process.env.NODE_ENV} on port ${PORT}...`.yellow.bold
  )
);

export default server;
