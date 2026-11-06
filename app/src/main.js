import '@fontsource/bitter/latin-700.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-600.css';
import './styles/tokens.css';
import './styles/base.css';
import { createContext } from './composition/create-context.js';
import { mount } from './features/shell/index.js';

mount(document.getElementById('app'), createContext());
