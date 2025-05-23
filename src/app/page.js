// "use client"
import { cookies } from 'next/headers';
import Dashboard from "./dashboard/page";
import SignIn from "./signin/page";

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get('token'); // Replace 'token' with your actual cookie name

  return (
    <>
      {token ? <Dashboard /> : <SignIn />}
    </>
  );
}
