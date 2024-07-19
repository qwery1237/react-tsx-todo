import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Todos from './routes/Todos.tsx';
import { StyleSheetManager } from 'styled-components';
import emotionIsPropValid from '@emotion/is-prop-valid';

const router = createBrowserRouter([
  {
    path: '/react-tsx-todo/',
    element: <App />,
    children: [{ index: true, element: <Todos /> }],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyleSheetManager
      shouldForwardProp={emotionIsPropValid}
      enableVendorPrefixes={true}
    >
      <RouterProvider router={router} />
    </StyleSheetManager>
  </React.StrictMode>
);
