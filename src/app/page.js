// "use client"
import { cookies } from 'next/headers';
import Dashboard from "./dashboard/page";
import SignIn from "./signin/page";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token'); // Replace 'token' with your actual cookie name

  return (
    <>
      {token ? <Dashboard /> : <SignIn />}
    </>
  );
}
