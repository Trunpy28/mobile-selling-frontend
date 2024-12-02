import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./router/index.js"
import ClientPage from "./pages/ClientPage/ClientPage.jsx"
import { useDispatch } from "react-redux";
import userService from "./services/userService.js";
import { handleGetAccessToken } from "./services/axiosJWT.js";
import { useEffect } from "react";
import { setUser } from "./redux/userStore.js";

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            if (!route.adminManage) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <ClientPage>
                      <Page />
                    </ClientPage>
                  }
                />
              );
            } else
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.page}
                />
              );
          })}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
