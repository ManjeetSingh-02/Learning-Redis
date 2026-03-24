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

// hashmap for caching
const cache: { [key: string]: number } = {
  totalPageCount: 0,
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
    // check if totalPageCount is already calculated
    if (cache.totalPageCount)
      return response.status(200).json({ totalPageCount: cache.totalPageCount });

    const { data } = await axios.get('https://api.freeapi.app/api/v1/public/books');

    const totalPageCount = data.data.data.reduce(
      (acc: number, curr: Curr) =>
        curr.volumeInfo?.pageCount ? curr.volumeInfo.pageCount : 0 + acc,
      0
    );

    // cache the totalPageCount
    cache.totalPageCount = totalPageCount;

    // return the totalPageCount
    return response.status(200).json({ totalPageCount });
  },
};
