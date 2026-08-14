import { createRoot } from 'react-dom/client'
import App from './App'
import { XpDrops } from './components/XpDrops'
import 'flag-icons/css/flag-icons.min.css'
import './styles/global.css'
import './styles/werelden.css'
import './styles/werelden-talen.css'
import './styles/werelden-beweging.css'
import './styles/werelden-typografie.css'
import './styles/werelden-opties.css'
import './styles/werelden-materiaal.css'

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    {/* de vallende XP en het niveau-omhoog-moment: op de wortel, zodat ze
        ook tijdens een les, gesprek of duel gewoon verschijnen */}
    <XpDrops />
  </>
)
