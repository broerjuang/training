export type Todo = {
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
  baseURL: string;
  // Sometimes we want to set baseurl so we can use this class in different environments
  // For example, we can use this class in our tests to mock the API
  constructor(baseURL?: string) {
    this.baseURL = baseURL || '';
  }

  private _request<Data>(url: string, options?: RequestInit): Response<Data> {
    return fetch(this.baseURL + url, options).then((response) =>
      response.json()
    );
  }
  async getTodos() {
    const response = await this._request<Array<Todo>>('/api/todos');
    // const data = (await response.json()) as Response<Array<Todo>>;
    return response;
  }

  async createTodo(title: string) {
    const response = await this._request<Todo>('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    return response;
  }

  async updateTodo(id: string, title?: string, completed?: boolean) {
    const response = await this._request<Todo>(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, completed }),
    });

    return response;
  }

  async deleteTodo(id: string) {
    const response = await this._request<Todo>(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    return response;
  }
}

export const client = new APIClient();
