import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

const startServer = async () => {
  const PORT = ENV.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`[SEUConnect Backend API Active]`);
    console.log(`Port: ${PORT}`);
    console.log(`South Eastern University of Sri Lanka — Faculty of Technology`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });

  await connectDB();
};

startServer();
