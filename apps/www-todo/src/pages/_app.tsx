import { AppProps } from 'next/app';
import Head from 'next/head';

import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to www-todo!</title>
      </Head>
      <section className="todoapp">
        <Component {...pageProps} />
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Created by <a href="http://github.com/petehunt/">petehunt</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
}

export default CustomApp;
