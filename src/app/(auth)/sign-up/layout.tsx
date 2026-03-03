import { Footer } from "@/components/footer";
import { NavMain } from "@/components/nav-main";
import { Navbar } from "@/components/navbar";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const SignUpLayout = ({ children }: LayoutProps) => {
  return (
    <>
    <Navbar/>
    <div className="flex  flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">{children}</div>
    </div>
    <Footer />
    </>
  );
};

export default SignUpLayout;
