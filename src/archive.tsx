import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ArticleArchiveView } from './components/ArticleArchiveView';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArticleArchiveView />
  </StrictMode>
);
