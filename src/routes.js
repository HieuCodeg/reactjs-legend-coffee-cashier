import { Navigate, useRoutes } from 'react-router-dom';
// layouts

import SimpleLayout from './layouts/simple';
//

import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';

import Tables from './pages/Tables';
import Kitchen from './pages/Kitchen';

// ----------------------------------------------------------------------

export default function Router() {
    const routes = useRoutes([
        {
            path: 'login',
            element: <LoginPage />,
        },
        {
            path: 'home',
            element: <Tables />,
        },
        {
            path: 'kitchen',
            element: <Kitchen />,
        },
        {
            element: <SimpleLayout />,
            children: [
                { element: <Navigate to="login" />, index: true },
                { path: '404', element: <Page404 /> },
                { path: '*', element: <Navigate to="/404" /> },
            ],
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
    ]);

    return routes;
}
