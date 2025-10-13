import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import MainLayout from "./components/layout";
import Home from "./components/home";
import AlbumComponent from "./components/album";
import PhotoCardComponent from "./components/photoCard";

import "./App.css";

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="albums" element={<AlbumComponent />} />
            <Route path="cards" element={<PhotoCardComponent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
