import { requireAuth } from "@/lib/auth-utils";
import { caller } from '../trpc/server';


const Page =  async () => {
  await requireAuth();

  const data = await caller.getUsers();

  return (

    <div className=" min-h-screen min-w-screen flex items-center justify-center">
      Protected server component
    <div className=" flex flex-col gap-y-5">

      {JSON.stringify(data , null , 2)}

    </div>
    </div>
  )
}

export default Page;