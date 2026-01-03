import React from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import Inicio from '../Pages/Inicio';
import Vigilancia from '../Pages/Vigilancia';
import PrivateRouter from './PrivateRouter';
import ListaCelulares from '../Pages/Celulares/ListaCelulares';
import Layout from '../Pages/Layout';
import CelularesDesactivados from '../Pages/Celulares/CelularesDesactivados';
import Emergencias from '../Pages/Emergencias';
import CelularesSinSenal from '../Pages/Celulares/CelularesSinSenal';
import Incidencias from '../Pages/Incidencias/incidencias'
import LoginIncidencias from '../Pages/Incidencias/login/LoginIncidencias';
import PublicIncidencias from './PublicIncidencias';
import PrivateIncidencias from './PrivateIncidencias';
import Historial from '../Pages/Historial/Historial';
const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRouter element={<Layout />} />,
    children: [
      {
        path: "/",
        element: <Navigate to="/incidencias/login" replace />,
      },
      {
        path: "/inicio",
        element: <PrivateRouter element={<Inicio />} />,
      },
      {
        path: "/celular",
        element: <PrivateRouter element={<Outlet />} />,
        children: [
          {
            path: "/celular",
            element: <PrivateRouter element={<ListaCelulares />} />,
          },
          {
            path: "/celular/desactivados",
            element: <PrivateRouter element={<CelularesDesactivados />} />,
          },
          {
            path: "/celular/sin-señal",
            element: <PrivateRouter element={<CelularesSinSenal />} />,
          },
        ]
      },
      {
        path: "/emergencias",
        element: <PrivateRouter element={<Emergencias />} />,
      },
      {
        path: "/incidencias/login",
        element: <PublicIncidencias element={<LoginIncidencias  />} />,
      },
      {
        path: "/incidencias/lista",
        element: <PrivateIncidencias element={<Incidencias />} />,
      },
      {
        path: "/incidencias/historial",
        element: <PrivateIncidencias element={<Historial />} />,
      },
    ]
  },
  {
    path: "/vigilancia/:id?",
    element: <PrivateRouter element={<Vigilancia />} />,
  },
  // {
  //     path: "/login",
  //     element: <PublicRouter element={<Login />} />,
  // },
  // {
  //     path: "/registro",
  //     element: <PublicRouter element={<Register />} />,
  // },

]);


const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default AppRouter