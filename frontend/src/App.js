import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Organiser from "./Organiser";
import Participant from "./Participant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/organiser" element={<Organiser />} />
        <Route path="/participant" element={<Participant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;