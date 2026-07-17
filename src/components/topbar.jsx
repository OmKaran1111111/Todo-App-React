"use client";

import { useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useClerk();
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const isActive = (path) => pathname === path;

  const itemClass = (path) =>
    isActive(path) ? "!bg-[#8a5a5a] !border-[#8a5a5a] !text-white" : "";

  return (
    <div>
      <header className="
      bg-slate-800/75 backdrop-blur-[25px] backdrop-saturate-[190%] rounded-3xl px-5 py-6 shadow-[0_30px_60px_rgba(0,0,0,0.35)] animate-[scaleUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)]
      fixed top-0 left-0 w-full z-[9998] min-h-[70px] flex items-center justify-center p-5">
        <header style={{ marginTop: '-10px' }} className="text-[beige] text-center text-[30px] font-bold ">
          Todo App
        </header>
      </header>

      <button
        className="fixed z-[9999] py-[7px] px-[15px] bg-transparent border-none
          cursor-pointer top-[15px] left-[15px] text-white text-[30px]"
        onClick={toggleSidebar}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <div
        className="fixed z-[9999] py-[7px] px-[15px] bg-transparent border-none
          cursor-pointer top-[15px] right-[15px] text-[30px]"
      >
        <Link
          href="/search"
          className="bg-transparent border-none text-[#edcccc] py-2 px-5
            text-base cursor-pointer self-center"
        >
          🔍
        </Link>
      </div>

      <div className={`sidebar z-[10000] ${isOpen ? "open" : ""}`}>
        <button className="fixed z-[101] py-[7px] px-[15px] bg-transparent border-none 
        cursor-pointer top-[15px] left-[15px] text-white text-[30px]" onClick={toggleSidebar}>
        {isOpen ? "✕" : "☰"}
        </button>
        <ul>
          <li className={itemClass("/home")}>
            <Link
              href="/home"
              onClick={closeSidebar}
              className="block w-full h-full"
              aria-current={isActive("/home") ? "page" : undefined}
            >
              Home
            </Link>
          </li>
          <li className={itemClass("/dashboard")}>
            <Link
              href="/dashboard"
              onClick={closeSidebar}
              className="block w-full h-full"
              aria-current={isActive("/dashboard") ? "page" : undefined}
            >
              DashBoard
            </Link>
          </li>
          <li className={itemClass("/addtask")}>
            <Link
              href="/addtask"
              onClick={closeSidebar}
              className="block w-full h-full"
              aria-current={isActive("/addtask") ? "page" : undefined}
            >
              Add Task
            </Link>
          </li>
          <li className={itemClass("/search")}>
            <Link
              href="/search"
              onClick={closeSidebar}
              className="block w-full h-full"
              aria-current={isActive("/search") ? "page" : undefined}
            >
              Search Task
            </Link>
          </li>
          <li className={itemClass("/tasklist")}>
            <Link
              href="/tasklist"
              onClick={closeSidebar}
              className="block w-full h-full"
              aria-current={isActive("/tasklist") ? "page" : undefined}
            >
              Tasks
            </Link>
          </li>
          <li
            className="cursor-pointer"
            onClick={async () => {
              console.log("LOGOUT CLICKED");
              closeSidebar();
              try {
                await signOut();
                router.push("/Login");
                console.log("SIGNOUT SUCCESS");
              } catch (err) {
                console.error("SIGNOUT FAILED:", err);
              }
            }}
          >
              Log Out
          </li>
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-[9996] backdrop-blur-[2px]"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};
export const TOPBAR_HEIGHT = 75;
export default TopBar;