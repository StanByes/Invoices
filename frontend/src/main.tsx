import {StrictMode} from "react"
import { createRoot } from "react-dom/client"
import "./assets/stylesheets/index.css"
import {Provider} from "react-redux";
import stores from "./stores/stores.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/users/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={stores}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AuthenticatedRoute>
              <HomePage/>
            </AuthenticatedRoute>
          }/>
          <Route path="/login" element={<LoginPage/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
