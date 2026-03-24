// type-imports
import type { Request, Response } from 'express';

// controller for module
export const controller = {
  // @controller GET /
  checkHealth: (_request: Request, response: Response) => {
    return response.status(200).json({ message: 'Service is healthy' });
  },
};
