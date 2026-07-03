import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./App.css";

const Header = () => {
  return (
    <header>
      <h1 className="text-[beige] text-center text-[30px] p-5 min-h-[100px] font-bold">
        Todo App</h1>
    </header>
  );
};

const RemainingTime = ({ targetDate }) => {
  if (!targetDate) return null;

  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return <span className="text-[red] font-bold">Time's up!</span>;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);

  return (
  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 
    py-0.5 text-xs font-semibold text-amber-500 md:text-sm md:px-3 md:py-1 ml-2 transition-all">
    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
    <span>
      {days}d {hours}h {minutes}m <span className="hidden sm:inline">left</span>
    </span>
  </span>
);
};

const PriorityDropdown = ({ currentPriority, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const priorities = [
    { id: 1, label: "Priority 1", emoji: "🔴" },
    { id: 2, label: "Priority 2", emoji: "🟠" },
    { id: 3, label: "Priority 3", emoji: "🔵" },
    { id: 4, label: "Priority 4 (None)", emoji: "⚪" },
  ];

  const currentOption =
    priorities.find((p) => p.id === currentPriority) || priorities[3];

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 220;
    const menuHeight = 220;

    const spaceRight = window.innerWidth - triggerRect.right;
    const spaceLeft = triggerRect.left;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    const openToRight = spaceRight >= menuWidth || spaceRight >= spaceLeft;
    const openBelow = spaceBelow >= menuHeight || spaceBelow >= spaceAbove;

    let left = openToRight
      ? Math.max(8, Math.min(triggerRect.left, window.innerWidth - menuWidth - 8))
      : Math.max(8, Math.min(triggerRect.right - menuWidth, window.innerWidth - menuWidth - 8));

    let top = openBelow
      ? triggerRect.bottom + 4
      : triggerRect.top - menuHeight - 4;

    setMenuStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${menuWidth}px`,
      zIndex: 9999,
    });
  };

  const openMenu = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex items-center justify-center p-2 text-xl bg-transparent rounded-full outline-none transition-transform duration-150 hover:scale-110 hover:bg-slate-200/50 cursor-pointer"
        onClick={openMenu}
        title={`Current: ${currentOption.label}`}
      >
        {currentOption.emoji}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-3 py-1 border-b border-slate-100 mb-1">
              <span className="text-xs font-semibold text-slate-500">Set Priority</span>
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400
                 transition-colors hover:bg-slate-100 hover:text-red-500 cursor-pointer"
                onClick={() => setIsOpen(false)}
                aria-label="Close priority dropdown"
              >
                ✕
              </button>
            </div>
            {priorities.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3 sm:py-2 text-sm transition-colors duration-150 cursor-pointer
                  ${
                    currentPriority === p.id
                      ? "bg-slate-50 font-medium text-slate-900"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                onClick={() => {
                  onSelect(p.id);
                  setIsOpen(false);
                }}
              >
                <span className="text-lg">{p.emoji}</span>
                <span>{p.label}</span>
                {currentPriority === p.id && (
                  <span className="ml-auto text-red-500 font-bold">✓</span>
                )}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

const Sidebar = ({ onAddTaskClick, onSearchTaskClick, onTaskListClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="fixed z-[101] py-[7px] px-[15px] bg-transparent border-none 
        cursor-pointer top-[15px] left-[15px] text-white text-[30px]" onClick={toggleSidebar}>
        {isOpen ? "✕" : "☰"}
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <li
            onClick={() => {
              setIsOpen(false);
              onAddTaskClick();
            }}
          >
            Add Task
          </li>
          <li
            onClick={() => {
              setIsOpen(false);
              onSearchTaskClick();
            }}
          >
            Search Task
          </li>
          <li
            onClick={() => {
              setIsOpen(false);
              onTaskListClick();
            }}
          >
            Tasks
          </li>
        </ul>
      </div>

      {isOpen && <div className="fixed inset-0 bg-transparent z-[99] backdrop-blur-[2px]"
         onClick={toggleSidebar}></div>}
    </div>
  );
};

const Add_Task = ({ onClose, Tasks, setTasks }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(4);
  const [Deadline, setDeadline] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now(),
      text: inputValue,
      priority: selectedPriority,
      completed: false,
      deadline: Deadline,
    };

    setTasks([...Tasks, newTask]);
    setInputValue("");
    setSelectedPriority(4);
    setDeadline(null);
  };

  const handleDeleteTask = (idToDelete) => {
    setTasks(Tasks.filter((Task) => Task.id !== idToDelete));
  };

  const handleUpdateTaskPriority = (taskId, newPriority) => {
    setTasks(
      Tasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task,
      ),
    );
  };

  const handleUpdateTaskDeadline = (taskId, newDeadline) => {
    setTasks(
      Tasks.map((task) =>
        task.id === taskId ? { ...task, deadline: newDeadline } : task,
      ),
    );
  };

  const handleToggleComplete = (taskId) => {
    setTasks(
      Tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const sortedTasks = [...Tasks].sort(
    (a, b) => Number(a.completed || false) - Number(b.completed || false),
  );

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-[16px] 
      backdrop-saturate-200 flex flex-col items-center z-[200] 
      animate-[fadeIn_0.25s_ease-out] py-[5vh] sm:py-[8vh] px-5" 
      onClick={onClose}>
      <div className="todo-container" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center w-full mb-3 px-1">
          <h3 className="text-xl font-bold text-[#dae5f4]">Add Task</h3>
          <button className="flex h-8 w-8 items-center justify-center rounded-full 
            bg-black/[0.04] text-base text-[var(--text-main)] transition-all 
            duration-200 hover:bg-red-500/15 hover:text-red-500 cursor-pointer" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleAddTask} className="flex flex-col gap-[10px] relative">
          <input
            type="text"
            placeholder="Enter a new task..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className="flex items-center gap-2">
            <span className="inline-block relative text-[2rem] cursor-pointer">
              📅
              <input
                type="date"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                value={Deadline || ""}
                onClick={(e) => e.target.showPicker()}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </span>
            {Deadline ? (
              <span className="text-sm text-[#ff6565] font-semibold">{Deadline}</span>
            ) : (
              <span className="text-sm text-slate-400">No deadline set</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 relative bottom-auto right-auto">
              <PriorityDropdown
                currentPriority={selectedPriority}
                onSelect={setSelectedPriority}
              />
              <span className="flex justify-between items-center">Priority</span>
            </div>
            <button type="submit">
              Add Task
            </button>
          </div>
        </form>

        <ul className="list-none mt-0.5 overflow-y-auto flex-1 min-h-0">
          {sortedTasks.map((Task) => (
            <li
              key={Task.id}
              className={
                `flex items-center justify-center relative p-[20px_55px] 
                sm:p-[20px_55px] p-[16px_45px] mb-3.5 rounded-2xl min-h-[95px] 
                sm:min-h-[95px] min-h-[80px] backdrop-blur-xl backdrop-saturate-200 
                border border-white/45 
                shadow-[0_20px_40px_rgba(0,0,0,0.07),0_6px_12px_rgba(0,0,0,0.03),
                inset_1px_1px_1px_rgba(255,255,255,0.65),inset_-1px_-1px_2px_rgba(0,0,0,0.1)] 
                transition-[transform,background-color,box-shadow] duration-300 
                ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 
                hover:bg-white/32 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12),
                0_12px_20px_rgba(0,0,0,0.05),inset_1px_1px_2px_rgba(255,255,255,0.8),
                inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                ${Task.completed 
                ? `opacity-40 !bg-[rgba(225,225,225,0.05)] !border-white/10 
                !shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] !transform-none line-through text-[#888]` 
                : ""
              }`
              }
            >
              <div className="flex flex-col items-center justify-center flex-1">
                <input
                  type="checkbox"
                  className="absolute left-5 top-1/2 -translate-y-1/2 appearance-none w-5 
                    h-5 border-2 border-[#aaa] rounded-full cursor-pointer transition-all 
                    duration-200 shrink-0 checked:bg-[var(--apple-blue,#0071e3)] 
                    checked:border-[var(--apple-blue,#0071e3)] checked:after:content-['✓'] 
                    checked:after:text-white checked:after:text-[14px] checked:after:absolute 
                    checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 
                    checked:after:-translate-y-1/2"
                  checked={Task.completed || false}
                  onChange={() => handleToggleComplete(Task.id)}
                />
                <div className={`font-bold text-center text-lg sm:text-[25px] break-words ${
                  Task.completed ? "text-[#888] line-through [text-shadow:0_1px_1px_rgba(246,165,165,0.4)]" : "text-[#dae5f4]"
                }`}>
                  {Task.text}</div>

                <div className="mt-[4px]">
                  <span className="inline-block relative cursor-pointer">
                    📅
                    <input
                      type="date"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      value={Task.deadline || ""}
                      onClick={(e) => e.target.showPicker()}
                      onChange={(e) =>
                        handleUpdateTaskDeadline(Task.id, e.target.value)
                      }
                    />
                  </span>
                  <span className="text-[0.85rem] text-[#ff6565] ml-1">{Task.deadline}</span>
                  <RemainingTime targetDate={Task.deadline} />
                </div>
              </div>

              <div>
                <PriorityDropdown
                  currentPriority={Task.priority || 4}
                  onSelect={(newPriority) =>
                    handleUpdateTaskPriority(Task.id, newPriority)
                  }
                />
                <button
                  onClick={() => handleDeleteTask(Task.id)}
                  className="absolute top-[15px] right-[15px] bg-transparent border-none 
                  text-[#e0d5d5] text-[1.1rem] cursor-pointer p-[2px] leading-none transition-all 
                  duration-200 z-10 hover:text-[#ef4444] hover:bg-[#ef4444]/[0.08]"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  
};

const Search_Task = ({ onClose, Tasks, setTasks }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleUpdateTaskDeadline = (taskId, newDeadline) => {
    setTasks(
      Tasks.map((task) =>
        task.id === taskId ? { ...task, deadline: newDeadline } : task,
      ),
    );
  };

  const filteredTasks = Tasks.filter(
    (task) =>
      !task.completed &&
      task.text.toLowerCase().includes(searchInput.trim().toLowerCase()),
  );

  const handleUpdateTaskPriority = (taskId, newPriority) => {
    setTasks(
      Tasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task,
      ),
    );
  };

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-[16px] 
      backdrop-saturate-200 flex flex-col items-center z-[200] 
      animate-[fadeIn_0.25s_ease-out] py-[5vh] sm:py-[8vh] px-5" onClick={onClose}>
      <div className="todo-container" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center w-full mb-3 px-1">
          <h3 className="text-xl font-bold text-[#dae5f4]">Search Tasks</h3>
          <button className="flex h-8 w-8 items-center justify-center rounded-full 
            bg-black/[0.04] text-base text-[var(--text-main)] transition-all 
            duration-200 hover:bg-red-500/15 hover:text-red-500 cursor-pointer" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <ul className="list-none mt-0.5 overflow-y-auto flex-1 min-h-0">
          {filteredTasks.map((task) => (
            <li key={task.id} className="flex items-center justify-center 
              relative p-[16px_45px] sm:p-[20px_55px] mb-3.5 rounded-2xl min-h-[80px] 
              sm:min-h-[95px] backdrop-blur-xl backdrop-saturate-200 border 
              border-white/45 shadow-[0_20px_40px_rgba(0,0,0,0.07),
              0_6px_12px_rgba(0,0,0,0.03),inset_1px_1px_1px_rgba(255,255,255,0.65),
              inset_-1px_-1px_2px_rgba(0,0,0,0.1)] transition-[transform,background-color,
              box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
              hover:-translate-y-1 hover:bg-white/32 
              hover:shadow-[0_30px_60px_rgba(0,0,0,0.12),0_12px_20px_rgba(0,0,0,0.05),
              inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col items-center justify-center flex-1">
                <div className={`font-bold text-center text-lg sm:text-[25px] break-words ${
                  task.completed ? "text-[#888] line-through [text-shadow:0_1px_1px_rgba(246,165,165,0.4)]" : "text-[#dae5f4]"
                }`}>
                  {task.text}</div>

                <div className="mt-[4px]">
                  <span className="inline-block relative cursor-pointer">
                    📅
                    <input
                      type="date"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      value={task.deadline || ""}
                      onClick={(e) => e.target.showPicker()}
                      onChange={(e) =>
                        handleUpdateTaskDeadline(task.id, e.target.value)
                      }
                    />
                  </span>
                  <span className="text-[0.85rem] text-[#ff6565] ml-1">{task.deadline}</span>
                  <RemainingTime targetDate={task.deadline} />
                </div>
              </div>
              <div>
                <PriorityDropdown
                  currentPriority={task.priority || 4}
                  onSelect={(newPriority) =>
                    handleUpdateTaskPriority(task.id, newPriority)
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const TaskList = ({ Tasks, setTasks, onClose }) => {
  const handleDeleteTask = (idToDelete) => {
    setTasks(Tasks.filter((Task) => Task.id !== idToDelete));
  };

  const handleUpdateTaskPriority = (taskId, newPriority) => {
    setTasks(
      Tasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task,
      ),
    );
  };

  const handleUpdateTaskDeadline = (taskId, newDeadline) => {
    setTasks(
      Tasks.map((task) =>
        task.id === taskId ? { ...task, deadline: newDeadline } : task,
      ),
    );
  };

  const handleToggleComplete = (taskId) => {
    setTasks(
      Tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const sortedTasks = [...Tasks].sort(
    (a, b) => Number(a.completed || false) - Number(b.completed || false),
  );

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-[16px] 
      backdrop-saturate-200 flex flex-col items-center z-[200] 
      animate-[fadeIn_0.25s_ease-out] py-[5vh] sm:py-[8vh] px-5" onClick={onClose}>
      <div className="todo-container" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center w-full mb-3 px-1">
          <h3 className="text-xl font-bold text-[#dae5f4]">All Tasks</h3>
          <button className="flex h-8 w-8 items-center justify-center rounded-full 
            bg-black/[0.04] text-base text-[var(--text-main)] transition-all 
            duration-200 hover:bg-red-500/15 hover:text-red-500 cursor-pointer" onClick={onClose}>
            ✕
          </button>
        </div>

        <ul className="list-none mt-0.5 overflow-y-auto flex-1 min-h-0">
          {sortedTasks.map((Task) => (
            <li
              key={Task.id}
              className={
                `flex items-center justify-center relative p-[20px_55px] 
                sm:p-[20px_55px] p-[16px_45px] mb-3.5 rounded-2xl min-h-[95px] 
                sm:min-h-[95px] min-h-[80px] backdrop-blur-xl backdrop-saturate-200 
                border border-white/45 
                shadow-[0_20px_40px_rgba(0,0,0,0.07),0_6px_12px_rgba(0,0,0,0.03),
                inset_1px_1px_1px_rgba(255,255,255,0.65),inset_-1px_-1px_2px_rgba(0,0,0,0.1)] 
                transition-[transform,background-color,box-shadow] duration-300 
                ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 
                hover:bg-white/32 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12),
                0_12px_20px_rgba(0,0,0,0.05),inset_1px_1px_2px_rgba(255,255,255,0.8),
                inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                ${Task.completed 
                ? `opacity-40 !bg-[rgba(225,225,225,0.05)] !border-white/10 
                !shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] !transform-none line-through text-[#888]` 
                : ""
              }`}
            >
              <div className="flex flex-col items-center justify-center flex-1">
                <input
                  type="checkbox"
                  className="absolute left-5 top-1/2 -translate-y-1/2 appearance-none w-5 
                    h-5 border-2 border-[#aaa] rounded-full cursor-pointer transition-all 
                    duration-200 shrink-0 checked:bg-[var(--apple-blue,#0071e3)] 
                    checked:border-[var(--apple-blue,#0071e3)] checked:after:content-['✓'] 
                    checked:after:text-white checked:after:text-[14px] checked:after:absolute 
                    checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 
                    checked:after:-translate-y-1/2"
                  checked={Task.completed || false}
                  onChange={() => handleToggleComplete(Task.id)}
                />
                <div className={`font-bold text-center text-lg sm:text-[25px] break-words ${
                  Task.completed ? "text-[#888] line-through [text-shadow:0_1px_1px_rgba(246,165,165,0.4)]" : "text-[#dae5f4]"
                }`}>
                  {Task.text}</div>

                <div className="mt-[4px]">
                  <span className="inline-block relative cursor-pointer">
                    📅
                    <input
                      type="date"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      value={Task.deadline || ""}
                      onClick={(e) => e.target.showPicker()}
                      onChange={(e) =>
                        handleUpdateTaskDeadline(Task.id, e.target.value)
                      }
                    />
                  </span>
                  <span className="text-[0.85rem] text-[#ff6565] ml-1">{Task.deadline}</span>
                  <RemainingTime targetDate={Task.deadline} />
                </div>
              </div>

              <div>
                <PriorityDropdown
                  currentPriority={Task.priority || 4}
                  onSelect={(newPriority) =>
                    handleUpdateTaskPriority(Task.id, newPriority)
                  }
                />
                <button
                  onClick={() => handleDeleteTask(Task.id)}
                  className="absolute top-[15px] right-[15px] bg-transparent border-none 
                  text-[#e0d5d5] text-[1.1rem] cursor-pointer p-[2px] leading-none transition-all 
                  duration-200 z-10 hover:text-[#ef4444] hover:bg-[#ef4444]/[0.08]"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const HighPriorityTasks = ({ Tasks, setTasks }) => {
  const topTasks = [...Tasks]
    .filter((task) => !task.completed)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);

  const handleUpdateTaskDeadline = (taskId, newDeadline) => {
    setTasks(
      Tasks.map((task) =>
        task.id === taskId ? { ...task, deadline: newDeadline } : task,
      ),
    );
  };

  const handleUpdateTaskPriority = (taskId, newPriority) => {
    setTasks(
      Tasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task,
      ),
    );
  };

  return (
    <div className="mt-[30px] pt-5 border-t-2 border-dashed border-[#e2e8f0]">
      <h2 className="text-[1.2rem] text-[#d9e1e9] mb-[15px]">Top 5 Tasks (By Priority)</h2>
      {topTasks.length === 0 ? (
        <p className="text-[#dae5f4] text-[0.95rem] text-center py-2.5">No pending tasks added yet!</p>
      ) : (
        <ul className="list-none flex flex-col gap-2">
          {topTasks.map((task) => (
            <li key={task.id} className="flex w-full min-w-0 flex-wrap items-center gap-3 px-3.5 py-3 rounded-xl 
              text-[0.95rem] text-[#d5d5e8] bg-white/14 backdrop-blur-[20px] backdrop-saturate-[200%] 
              border border-white/25 [box-shadow:inset_1px_1px_3px_rgba(0,0,0,0.06),_inset_-1px_-1px_2px_rgba(255,255,255,0.3)]">
              <PriorityDropdown
                currentPriority={task.priority || 4}
                onSelect={(newPriority) =>
                  handleUpdateTaskPriority(task.id, newPriority)
                }
              />
              <span className={`min-w-0 flex-1 font-bold text-left text-lg sm:text-[25px] break-words ${
              task.completed ? "text-[#888] line-through [text-shadow:0_1px_1px_rgba(246,165,165,0.4)]" : "text-[#dae5f4]"
            }`}>{task.text}</span>

              <span className="ml-[10px] shrink-0">
                <span className="inline-block relative cursor-pointer">
                  📅
                  <input
                    type="date"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    value={task.deadline || ""}
                    onClick={(e) => e.target.showPicker()}
                    onChange={(e) =>
                      handleUpdateTaskDeadline(task.id, e.target.value)
                    }
                  />
                </span>
                <span className="text-[0.85rem] text-[#ff6565] ml-1">{task.deadline}</span>
                <RemainingTime targetDate={task.deadline} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SearchButton = ({ onSearchClick }) => {
  return (
    <div className="fixed z-[101] py-[7px] px-[15px] bg-transparent border-none 
      cursor-pointer top-[15px] right-[15px] text-transparent text-[30px]">
      <button className="bg-transparent border-none text-[#edcccc] py-2 px-5 
        text-base cursor-pointer self-center" onClick={onSearchClick}>
        🔍
      </button>
    </div>
  );
};

const AddButton = ({ onAddTaskClick }) => {
  return (
    <div className="fixed z-[101] py-[7px] px-[15px] bg-transparent border-none 
      cursor-pointer bottom-[15px] right-[15px] text-transparent text-[30px]">
      <button className="bg-transparent border-none text-[#edcccc] py-2 px-5 
        text-base cursor-pointer self-center" onClick={onAddTaskClick}>
        ➕
      </button>
    </div>
  );
};

const TaskListButton = ({ onTaskListClick }) => {
  return (
    <div className="fixed z-[101] py-[7px] px-[15px] bg-transparent border-none 
      cursor-pointer bottom-[15px] left-1/2 -translate-x-1/2">
      <button className="bg-transparent border-none text-[#edcccc] py-2 px-5 
        text-base cursor-pointer self-center" onClick={onTaskListClick}>
        Load All Tasks
      </button>
    </div>
  );
};

const Todo_App = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);

  const [Tasks, setTasks] = useState(() => {
    const sTasks = localStorage.getItem("todo_tasks");
    return sTasks ? JSON.parse(sTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("todo_tasks", JSON.stringify(Tasks));
  }, [Tasks]);

  return (
    <div>
      <SearchButton onSearchClick={() => setIsSearchOpen(true)} />
      <Header />
      <Sidebar
        onAddTaskClick={() => setIsAddTaskOpen(true)}
        onSearchTaskClick={() => setIsSearchOpen(true)}
        onTaskListClick={() => setIsTaskListOpen(true)}
      />

      {isAddTaskOpen && (
        <Add_Task
          onClose={() => setIsAddTaskOpen(false)}
          Tasks={Tasks}
          setTasks={setTasks}
        />
      )}

      {isSearchOpen && (
        <Search_Task
          onClose={() => setIsSearchOpen(false)}
          Tasks={Tasks}
          setTasks={setTasks}
        />
      )}

      <HighPriorityTasks Tasks={Tasks} setTasks={setTasks} />

      {isTaskListOpen && (
        <TaskList
          onClose={() => setIsTaskListOpen(false)}
          Tasks={Tasks}
          setTasks={setTasks}
        />
      )}  
      <TaskListButton onTaskListClick={() => setIsTaskListOpen(true)} />
      <AddButton onAddTaskClick={() => setIsAddTaskOpen(true)} />
    </div>
  );
};

export default Todo_App;
