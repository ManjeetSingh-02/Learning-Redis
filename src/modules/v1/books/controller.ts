// internal-imports
import { redis } from '../../../core/index.js';

// external-imports
import axios from 'axios';

// type-imports
import type { Request, Response } from 'express';

// type for Curr
type Curr = {
  volumeInfo?: {
    pageCount?: number;
  };
};

// controller for module
export const controller = {
  // @controller GET /
  getBooks: async (_request: Request, response: Response) => {
    const { data } = await axios.get('https://api.freeapi.app/api/v1/public/books');
    return response.status(200).json(data);
  },

  // @controller GET /totalPages
  getBooksTotalPages: async (_request: Request, response: Response) => {
    // check if totalPageCount is cached
    const cachedTPC = await redis.get('totalPageCount');
    if (cachedTPC) return response.status(200).json({ totalPageCount: Number(cachedTPC) });

    const { data } = await axios.get('https://api.freeapi.app/api/v1/public/books');

    const totalPageCount = data.data.data.reduce(
      (acc: number, curr: Curr) =>
        curr.volumeInfo?.pageCount ? curr.volumeInfo.pageCount : 0 + acc,
      0
    );

    // cache the totalPageCount
    await redis.set('totalPageCount', totalPageCount);

    // return the totalPageCount
    return response.status(200).json({ totalPageCount });
  },
};
