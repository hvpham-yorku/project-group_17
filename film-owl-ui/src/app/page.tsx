import Logo from "../../public/logo-dark.png";
import Image from "next/image";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <NavBar />
        <Image
          src={Logo}
          alt="Film Owl Logo"
        />
        <h1 className="text-4xl font-bold text-center">Welcome to Film Owl</h1>
        <p className="text-xl text-center">The best place to find all the latest movies and TV shows</p>
      </main>
    </div>
  );
}
