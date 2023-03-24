import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import reducers from './components/reducers';
import ReduxThunk from 'redux-thunk';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './index.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>

    <BrowserRouter>
      <QueryClientProvider
        client={queryClient}
      >
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>

);


reportWebVitals();
