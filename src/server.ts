import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

// import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
// import express from 'express';
// import { join } from 'node:path';
// import * as https from 'https'; // Import the HTTPS module
// import * as fs from 'fs'; // Import the File System module

// const browserDistFolder = join(import.meta.dirname, '../browser');

// const app = express();
// const angularApp = new AngularNodeAppEngine();

// /**
//  * Example Express Rest API endpoints can be defined here.
//  * Uncomment and define endpoints as necessary.
//  *
//  * Example:
//  * ```ts
//  * app.get('/api/{*splat}', (req, res) => {
//  *   // Handle API request
//  * });
//  * ```
//  */

// /**
//  * Serve static files from /browser
//  */
// app.use(
//   express.static(browserDistFolder, {
//     maxAge: '1y',
//     index: false,
//     redirect: false,
//   })
// );

// /**
//  * Handle all other requests by rendering the Angular application.
//  */
// app.use((req, res, next) => {
//   angularApp
//     .handle(req)
//     .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
//     .catch(next);
// });

// /**
//  * Start the server if this module is the main entry point.
//  * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
//  */
// if (isMainModule(import.meta.url)) {
//   const port = process.env['PORT'] || 4000;

//   // Paths to your SSL certificate and key files
//   const privateKeyPath = join(import.meta.dirname, 'cert/localhost+2-key.pem'); // Adjust path as needed
//   const certificatePath = join(import.meta.dirname, 'cert/localhost+2.pem'); // Adjust path as needed

//   try {
//     const privateKey = fs.readFileSync(privateKeyPath);
//     const certificate = fs.readFileSync(certificatePath);

//     const httpsOptions = {
//       key: privateKey,
//       cert: certificate,
//     };

//     // Create an HTTPS server
//     const server = https.createServer(httpsOptions, app);

//     server.listen(port, () => {
//       // Removed the 'error' parameter from the callback
//       console.log(`Node Express server listening on https://localhost:${port}`);
//     });

//     // Listen for the 'error' event to handle server errors (e.g., port already in use)
//     server.on('error', (error: NodeJS.ErrnoException) => {
//       if (error.code === 'EADDRINUSE') {
//         console.error(`Port ${port} is already in use. Please use a different port or stop the process using it.`);
//       } else {
//         console.error('Server error:', error);
//       }
//       process.exit(1); // Exit the process on critical errors
//     });
//   } catch (error) {
//     console.error('Error loading SSL certificates:', error);
//     // Fallback to HTTP if SSL certificates cannot be loaded
//     app.listen(port, (error) => {
//       if (error) {
//         throw error;
//       }
//       console.log(`Node Express server listening on http://localhost:${port} (SSL failed)`);
//     });
//   }

//   // app.listen(port, (error) => {
//   //   if (error) {
//   //     throw error;
//   //   }

//   //   console.log(`Node Express server listening on http://localhost:${port}`);
//   // });
// }

// /**
//  * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
//  */
// export const reqHandler = createNodeRequestHandler(app);
