import * as React from "react";
import { HomeWebPage } from "./pages/HomeWebPage"
import { RegisterWebPage } from "./pages/RegisterWebPage"
import { NotFoundWebPage } from "./pages/NotFoundWebPage"
import { LoginWebPage} from "./pages/LoginWebPage"
import { InitWebPage } from "./pages/InitWebPage"
import { UploadPhotoPage } from "./pages/UploadPhotoPage"
import { EditAlbumPage } from "./pages/EditAlbumPage"
import { MonitorPage } from "./pages/MonitorPage";
import { ViewPhotosPage } from "./pages/ViewPhotosPage";
import { RequireAuth }  from "./components/RequireAuth";
 import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { EditProfilePage } from "./pages/EditWebPage";
import { HistoricalPage } from "./pages/HistoricalPage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFoundWebPage />,
  },
  {
    path: "/",
    element: <HomeWebPage />,
  },
  {
    path: "/login",
    element: <LoginWebPage/>,
  },
  {
    path: "/monitor",
    element: <MonitorPage/>,
  },
  // Utilizacion de Auth 
  {
    path: "/init",
    element: (
        <InitWebPage />
    ),
  },
  {
    path: "/edit",
    element:
    (
        <EditProfilePage/>
    ),
  },
  {
    path: "/upload",
    element: (
        <UploadPhotoPage/>
    ),
  },
  {
    path: "/editAlbums",
    element: (
        <EditAlbumPage/>
    ),
  },
  {
    path: "/register",
    element: <RegisterWebPage />,
  },
  {
    path: "/viewphotos",
    element: (
        <ViewPhotosPage/>
    ),
  },
  {
    path: "/monitor",
    element: (
        <MonitorPage/>
    ),
  },
  {
    path: "/historical",
    element: (
        <HistoricalPage/>
    ),
  },

]);


export function Router() {
  return (<RouterProvider router={router} />)
}
