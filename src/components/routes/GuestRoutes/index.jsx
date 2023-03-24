import { Route, Routes, Navigate } from "react-router-dom";
// pages
import Home from "../../pages/Home";

const GuestRoutes = () => {
  return (
    <>
      <Routes>
        {/* index */}
        <Route path={"/*"} element={<Home />}>
          <Route path={"home/"} element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default GuestRoutes;
