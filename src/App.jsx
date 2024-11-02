import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./router/index.js"
import ClientPage from "./pages/ClientPage/ClientPage.jsx"

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
