import { Outlet } from "react-router";
import { useState } from "react";
import Header from "./Header";
import { Login } from "../Login";
import Footer from "./Footer";

const AppLayout = ({ user, setUser }) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <main>
      <Header setShowLogin={setShowLogin} user={user} />
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} setUser={setUser} />
      <div className="container">
        <Outlet context={{ setShowLogin }} />
      </div>
      <Footer />
    </main>
  );
};

export default AppLayout;
