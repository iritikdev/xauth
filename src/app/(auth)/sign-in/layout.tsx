import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const SignInLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar  />
      <div>{children}</div>
    </>
  );
};

export default SignInLayout;
