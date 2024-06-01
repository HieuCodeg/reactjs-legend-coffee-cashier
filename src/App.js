import './App.css';

// Toast container
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';

// ----------------------------------------------------------------------

export default function App() {
    return (
        <ThemeProvider>
            <ToastContainer position="top-right" autoClose={2000} />
            <Router />
        </ThemeProvider>
    );
}
