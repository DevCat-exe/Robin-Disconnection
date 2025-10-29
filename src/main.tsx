
  import { createRoot } from "react-dom/client";
  import { BrowserRouter } from "react-router-dom";
  import { Toaster } from "react-hot-toast";
  import App from "./App.tsx";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#dc2626',
            border: '2px solid #7f1d1d',
            boxShadow: '0 0 10px rgba(139, 0, 0, 0.5)',
          },
          success: {
            style: {
              background: '#111',
              color: '#16a34a',
              border: '2px solid #15803d',
            },
          },
          error: {
            style: {
              background: '#111',
              color: '#dc2626',
              border: '2px solid #991b1b',
            },
          },
        }}
      />
    </BrowserRouter>
  );
