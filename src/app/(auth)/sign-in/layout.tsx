import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const SignInLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default SignInLayout;
