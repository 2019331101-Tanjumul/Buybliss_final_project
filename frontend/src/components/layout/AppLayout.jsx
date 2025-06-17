import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import Header from "./Header";
import { Login } from "../Login";
import Footer from "./Footer";
import { useUserStorage } from "../../hooks/useLocalStorage";

const AppLayout = () => {
  const { getUser, removeUser } = useUserStorage();
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getUser());
  }, [getUser]);

  return (
    <main>
      <Header
        setShowLogin={setShowLogin}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        getUser={getUser}
        removeUser={() => removeUser(currentUser.email)}
      />
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} setCurrentUser={setCurrentUser} />
      <div className="container">
        <Outlet context={{ setShowLogin }} />
      </div>
      <Footer />
    </main>
  );
};

export default AppLayout;
