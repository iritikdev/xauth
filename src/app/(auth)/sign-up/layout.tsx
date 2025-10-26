import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const SignUpLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex  flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">{children}</div>
    </div>
  );
};

export default SignUpLayout;
