import { createRoot } from 'react-dom/client'
import App from './App'
import 'flag-icons/css/flag-icons.min.css'
import './styles/global.css'
import './styles/werelden.css'
import './styles/werelden-talen.css'

createRoot(document.getElementById('root')!).render(<App />)
