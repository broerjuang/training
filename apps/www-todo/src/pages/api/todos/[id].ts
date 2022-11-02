import { NextApiRequest, NextApiResponse } from 'next';
import {
  getTodoById,
  updateTodoById,
  deleteTodoById,
} from '../../../../db/todo-controller';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const data = JSON.parse(req.body);
    try {
      const response = updateTodoById(
        req.query.id as string,
        data?.title,
        data?.completed
      );
      res.status(200).json({ data: response, success: true, message: null });
    } catch (error) {
      res
        .status(403)
        .json({ data: null, message: error.message, success: false });
    }
  } else if (req.method === 'GET') {
    try {
      const todo = getTodoById(req.query.id as string);
      res.status(200).json({ data: todo, success: true, message: null });
    } catch (error) {
      res
        .status(403)
        .json({ data: null, message: error.message, success: false });
    }
  } else if (req.method === 'DELETE') {
    deleteTodoById(req.query.id as string);
    res.status(200).json({ success: true, data: null, message: null });
  }
}
