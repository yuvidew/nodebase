import prisma from "@/lib/db";

const Page = async () => {
  const user = await prisma.user.findMany();
  return (
    <div className=" min-h-screen min-w-screen flex items-center justify-center">
      {JSON.stringify(user)}
    </div>
  )
}

export default Page;