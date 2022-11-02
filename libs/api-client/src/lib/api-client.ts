type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type Response<Data> = Promise<{
  data: Data | null;
  message: string | null;
  success: boolean;
}>;

interface IAPIClient {
  getTodos: () => Response<Array<Todo>>;
  createTodo: (title: string) => Response<Todo>;
  updateTodo: (
    id: string,
    title?: string,
    completed?: boolean
  ) => Response<Todo>;
  deleteTodo: (id: string) => Response<Todo>;
}

export class APIClient implements IAPIClient {
  async getTodos() {
    const response = await fetch('/api/todos');
    const data = (await response.json()) as Response<Array<Todo>>;
    return data;
  }

  async createTodo(title: string) {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    const data = (await response.json()) as Response<Todo>;
    return data;
  }

  async updateTodo(id: string, title?: string, completed?: boolean) {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, completed }),
    });
    const data = (await response.json()) as Response<Todo>;
    return data;
  }

  async deleteTodo(id: string) {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    const data = (await response.json()) as Response<Todo>;
    return data;
  }
}

export const client = new APIClient();
