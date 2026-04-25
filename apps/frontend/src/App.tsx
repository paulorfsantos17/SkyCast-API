import { Toaster } from './components/ui/toaster';
import { LocationProvider } from './contexts/LocationContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
  <>
    <LocationProvider>
      <AppRoutes />
      <Toaster />
    </LocationProvider>
  </>
  )
}

export default App 