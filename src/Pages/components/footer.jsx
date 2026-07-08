import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `block py-2 px-5 rounded-full text-base cursor-pointer self-center transition-colors ${
      isActive(path)
        ? "bg-[#8a5a5a] text-white font-bold"
        : "bg-transparent text-[#edcccc]"
    }`;

  return (
    <footer className="fixed bottom-0 left-0 w-full z-[9998] min-h-[70px] flex items-center 
      justify-between px-8 pb-5 bg-slate-800/75 backdrop-blur-[25px] backdrop-saturate-[190%] 
      rounded-3xl px-5 py-6 shadow-[0_30px_60px_rgba(0,0,0,0.35)]
      animate-[scaleUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)] fixed 
      w-full z-[9998] max-h-[40px] flex items-center justify-center p-5">
      <div className="flex-1" />

      <div className="fixed z-[101] bottom-[15px] left-1/2 -translate-x-1/2">
        <Link
          to="/tasklist"
          onClick={() => {}}
          className={linkClass("/tasklist")}
          aria-current={isActive("/tasklist") ? "page" : undefined}
        >
          Load All Tasks
        </Link>
      </div>

      <div className="fixed z-[101] bottom-[15px] right-[15px] text-[30px]">
        <Link
          to="/addtask"
          className={linkClass("/addtask")}
          aria-current={isActive("/addtask") ? "page" : undefined}
        >
          ➕
        </Link>
      </div>
    </footer>
  );
};

export const FOOTER_HEIGHT = 70;
export default Footer;