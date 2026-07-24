"use client";
import Image from "next/image";
import "./style/style.css";
import { useTheme } from "next-themes";
export function ThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
    >
      {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}

export default function Home() {
  return (
    <div>
      <nav>
        <div><img src="img/1111.png" alt="logo" width="45px" /></div>
        <ul>
          <a href=""><li>Home</li></a>
          <a href=""><li>Experience</li></a>
          <a href=""><li>Project</li></a>
          <a href=""><li>Contact</li></a>
        </ul>
        <ThemeButton></ThemeButton>
      </nav>
      <main className="flex g-4 max-md: flex-col">
        <section className="flex flex-col items-center w-[20%] max-md:w-[100%] ">
          <div className="flex flex-col items-center w-[100%]">
            <div className="p-4"><img src="img/1111.png" alt="logo" width="60px" /></div>
            <h2 className=" text-lg">Danny Hsu</h2>
            <h3 className="text-base">Software & Front-end Engineer / Developer</h3>
          </div>
        </section>
        <section className="flex jutify-center items-center w-[80%]">
          <div className="card">
            <img src="img/1111.png" alt="logo" width="60px" />
            <h2>title</h2>
            <h4>subtitle</h4>
          </div>
        </section>
      </main>
      <footer className="flex justify-center py-4 bg-cyan-50">Copyright © 2026 Danny Hsu</footer>
    </div>
  );
}
