import React from "react";
import Button from "@material-ui/core/Button";

type Props = {
  readonly logged: React.Dispatch<React.SetStateAction<boolean>>;
  readonly className: string;
};

export default function LogoutButton({ logged, className }: Props) {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    logged(false);
  };
  return (
    <div>
      <Button className={className} onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}