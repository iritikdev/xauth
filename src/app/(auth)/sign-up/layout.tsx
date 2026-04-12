import MinimalFooter from "@/components/layout/minimal-footer";
import { AppHeader } from "@/components/layout/app-header";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const SignUpLayout = ({ children }: LayoutProps) => {
  return (
    <>
    <AppHeader/>
    <div className="flex  flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">{children}</div>
    </div>
    <MinimalFooter />
    </>
  );
};

export default SignUpLayout;
