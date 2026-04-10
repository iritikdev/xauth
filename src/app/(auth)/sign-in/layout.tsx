
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const SignInLayout = ({ children }: LayoutProps) => {
  return (
    <>
      
      <div>{children}</div>
    </>
  );
};

export default SignInLayout;
