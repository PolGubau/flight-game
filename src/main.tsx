import ReactDOM from "react-dom/client";
import "./index.css";
import React from "react";
import App from "./App.js";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <Canvas shadows>
    <Suspense fallback={<>Engegant el motor...</>}>
      <App />
    </Suspense>
  </Canvas>
);
