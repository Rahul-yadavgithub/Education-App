import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserProvider from "./Context/UserContext.jsx"; // ✅ import UserProvider
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
       <Toaster position="top-right" />
    </UserProvider>
  </StrictMode>
);
