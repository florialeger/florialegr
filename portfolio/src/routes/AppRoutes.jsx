import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "@/App";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Work from "@/pages/Work";
import Playground from "@/pages/Playground";
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="work" element={<Work />} />
          <Route path="playground" element={<Playground />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}