import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import store from "./redux/store";

// Create root element safely
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Ensure index.html has a div with id='root'.");
}
const root = ReactDOM.createRoot(rootElement);

// Render the app with Redux and Ant Design theme
root.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2E3840",
          colorBorder: "#2E3840",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
);

// Track performance metrics (optional)
reportWebVitals();
