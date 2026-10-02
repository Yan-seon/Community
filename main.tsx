import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Community from './app/community-v3';
import './app/globals.css';
createRoot(document.getElementById('root')!).render(<StrictMode><Community/></StrictMode>);
