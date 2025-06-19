import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [refresh, setRefresh] = useState(false);
  const atualizar = () => setRefresh((prev) => !prev);

  return (
    <Router>
      <AppRoutes atualizar={atualizar} refresh={refresh} />
    </Router>
  );
}
