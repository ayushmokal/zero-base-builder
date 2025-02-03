import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="https://i.ibb.co/BCHWQmq/Black-bg-2-1-e1722342966946-300x55.png" 
        alt="Technikaz" 
        className="h-6 w-auto sm:h-8 hover:opacity-80 transition-opacity"
      />
    </Link>
  );
}