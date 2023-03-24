import './components/pages/Styles/style.css';
import RoutesContainer from './components/routes';
import { ToastContent } from './components/utilities/Alerts';

function App() {
  return (
    <div className="App">
      <RoutesContainer />
      <ToastContent />
    </div>
  );
}

export default App;
