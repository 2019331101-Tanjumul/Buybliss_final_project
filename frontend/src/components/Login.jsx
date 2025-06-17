import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { login } from "../utils/actions";
import { useUserStorage } from "../hooks/useLocalStorage";

export const Login = ({ isOpen, onClose, setCurrentUser }) => {
  const { setUser } = useUserStorage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
      const onEsc = (e) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onEsc);
      return () => {
        document.body.classList.remove("no-scroll");
        window.removeEventListener("keydown", onEsc);
      };
    }
  }, [isOpen, onClose]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email) {
      console.log("Email is empty");
      return;
    }
    if (!password) {
      console.log("Password is empty");
      return;
    }
    // console.log(String(email), String(password));
    setLoading(true);
    const data = await login(String(email), String(password));
    console.log("handleSubmit", data);
    setLoading(false);
    if (data.user.email) {
      setUser(data.user);
      setCurrentUser(data.user);
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <form onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
        <Button className="close-modal-btn" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none">
            <g id="Menu / Close_SM">
              <path
                id="Vector"
                d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"
                stroke="oklch(63.7% 0.237 25.331)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </Button>
        <div>
          <h1>Log In</h1>
          <p>By logging in, you agree to our Privacy Policy and consent to receive emails.</p>
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? (
            "Loading ..."
          ) : (
            <>
              Continue
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12H19M19 12L13 6M19 12L13 18"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
