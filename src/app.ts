// internal-imports
import { loadModules } from './core/index.js';

// external-imports
import express from 'express';

// type-imports
import type { Application } from 'express';

// function to create application
export default function createApp(): Application {
  // create express application
  const application = express();

  // attach middlewares
  application.use(express.json()).use(express.urlencoded({ extended: true }));

  // load modules
  loadModules(application);

  // return the application
  return application;
}
