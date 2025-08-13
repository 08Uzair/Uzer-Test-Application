import { useState, useEffect } from "react";

const useAuthenticated = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("profile");
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        if (parsedProfile && parsedProfile.result && parsedProfile.token) {
          setUser(parsedProfile.result);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error parsing localStorage profile:", error);
      setIsAuthenticated(false);
    }
  }, []);

  return { user, isAuthenticated };
};

export default useAuthenticated;
