import { NextApiRequest, NextApiResponse } from 'next';
import { createTodo, getTodos } from '../../../db/todo-controller';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = JSON.parse(req.body);
    if (!data?.title) {
      res
        .status(403)
        .json({ data: null, success: false, message: 'Title is required' });
    } else {
      const response = createTodo(data?.title, data?.completed);
      res.status(200).json({ data: response, success: true, message: null });
    }
  } else {
    const todos = getTodos();
    res.status(200).json({ data: todos, success: true, message: null });
  }
}
