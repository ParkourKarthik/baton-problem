import * as http from 'http';
import app from './app';
import config from './config';

const PORT: number = config.app.port;

// use environment set PORT or custom port. Signifacant in deploy
http.createServer(app).listen(process.env.PORT || PORT, () => {
  console.log('Express server listening on port ' + PORT);
});

export default app;
