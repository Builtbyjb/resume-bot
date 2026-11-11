import { Link } from "@tanstack/react-router";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center" >
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="relative mb-8" >
          <span className="font-serif text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-primary/10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-primary to-primary/60 select-none animate-pulse">
              404
            </span>
          </div>
        </div>
      </div>
      <h1 className="text-[2rem]" > Page not found </h1>
      <Link to="/" className="text-accent hover:underline" >
        Back to home
      </Link>
    </main>
  );
}
