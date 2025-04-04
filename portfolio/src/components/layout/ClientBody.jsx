import { useEffect } from "react";

export default function ClientBody({ children }) {
  useEffect(() => {
    document.body.className = "antialiased";
  }, []);

  return <>{children}</>; 
}