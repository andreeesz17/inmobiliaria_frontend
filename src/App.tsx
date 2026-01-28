import AppRouter from "./router/AppRouter";
import Notifications from "./components/Notifications";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <div className="relative">
        <AppRouter />
        <Notifications />
      </div>
    </ErrorBoundary>
  );
}

export default App;
