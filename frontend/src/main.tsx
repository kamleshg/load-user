import { SquidContextProvider } from '@squidcloud/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SquidContextProvider
    options={{
      appId: 'qv5qz2aob5iv8jvupo',
      region: 'us-east-1.aws', // example: 'us-east-1.aws'
      environmentId: 'dev', // choose one of 'dev' or 'prod'
      squidDeveloperId: 'dktqzx4wc4i243s7s7',
    }}
  >
    <App />
  </SquidContextProvider>
);