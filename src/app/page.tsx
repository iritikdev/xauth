import { SignOut } from "@/components/sign-out";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth()
  if(!session) redirect("/sign-in")
  return (
    <>
      <div className="bg-gray-100 rounded-lg p-4 text-center mb-6">
        <p className="text-gray-600">Signed in as: {session.user?.name}</p>
        <p className="text-gray-600">{session.user?.email}</p>
        <p className="text-gray-600"> {session.user?.id}</p>
        <p className="font-medium">TODO</p>
      </div>

      <SignOut />
    </>
  );
};

export default Page;