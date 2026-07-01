import { useState, useEffect } from "react";
import LiquidGlass from "liquid-glass-react";
import "./App.css";

const Header = () => {
  return (
    <div>
      <h1 className="headerclass">Todo App</h1>
    </div>
  );
};

const RemainingTime = ({ targetDate }) => {
  if (!targetDate) return null;

  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return <span className="time-up-text">Time's up!</span>;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);

  return (
    <span className="remaining-time-text">
      ({days}d {hours}h {minutes}m left)
    </span>
  );
};

const PriorityDropdown = ({ currentPriority, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const priorities = [
    { id: 1, label: "Priority 1", emoji: "🔴" },
    { id: 2, label: "Priority 2", emoji: "🟠" },
    { id: 3, label: "Priority 3", emoji: "🔵" },
    { id: 4, label: "Priority 4 (None)", emoji: "⚪" },
  ];

  const currentOption =
    priorities.find((p) => p.id === currentPriority) || priorities[3];

  return (
    <div className="priority-dropdown-container">
      <button
        type="button"
        className="priority-trigger-icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={`Current: ${currentOption.label}`}
      >
        {currentOption.emoji}
      </button>

      {isOpen && (
        <>
          <div className="dropdown-backdrop" onClick={() => setIsOpen(false)} />
          <div className="priority-menu" onClick={(e) => e.stopPropagation()}>
            {priorities.map((p) => (
              <div
                key={p.id}
                className={`priority-item ${currentPriority === p.id ? "selected" : ""}`}
                onClick={() => {
                  onSelect(p.id);
                  setIsOpen(false);
                }}
              >
                <span className="priority-emoji">{p.emoji}</span>
                <span className="priority-label">{p.label}</span>
                {currentPriority === p.id && (
                  <span className="checkmark">✓</span>
                )}
              </div>
            ))}
          </div>
        </>
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
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "✕" : "☰"}
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <li
            className="AddTask"
            onClick={() => {
              setIsOpen(false);
              onAddTaskClick();
            }}
          >
            Add Task
          </li>
          <li
            className="SearchTask"
            onClick={() => {
              setIsOpen(false);
              onSearchTaskClick();
            }}
          >
            Search Task
          </li>
          <li
            className="TaskList"
            onClick={() => {
              setIsOpen(false);
              onTaskListClick();
            }}
          >
            Tasks
          </li>
        </ul>
      </div>

      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
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
    setDeadline(1);
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
    <div className="pop_up" onClick={onClose}>
      <div className="todo-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-task-btn" onClick={onClose}>
          ✕
        </button>

        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            placeholder="Enter a new task..."
            value={inputValue}
            onChange={handleInputChange}
            className="task-input"
          />
          <span className="form-date-picker-wrapper">
            📅
            <input
              type="date"
              className="form-date-input"
              value={Deadline || ""}
              onClick={(e) => e.target.showPicker()}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </span>
          <div className="form-controls">
            <div className="priority-selection-wrapper">
              <PriorityDropdown
                currentPriority={selectedPriority}
                onSelect={setSelectedPriority}
              />
              <span className="priority-label-text">Priority</span>
            </div>
            <button type="submit" className="submit-task-btn">
              Add Task
            </button>
          </div>
        </form>

        <ul className="task-list">
          {sortedTasks.map((Task) => (
            <li
              key={Task.id}
              className={`task-item ${Task.completed ? "completed-task" : ""}`}
            >
              <div className="task-text-container">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={Task.completed || false}
                  onChange={() => handleToggleComplete(Task.id)}
                />
                <div className="task-text">{Task.text}</div>

                <div className="task-deadline-details">
                  <span className="editable-deadline-container">
                    📅
                    <input
                      type="date"
                      className="hidden-date-input"
                      value={Task.deadline || ""}
                      onClick={(e) => e.target.showPicker()}
                      onChange={(e) =>
                        handleUpdateTaskDeadline(Task.id, e.target.value)
                      }
                    />
                  </span>
                  <span className="task-deadline-date">{Task.deadline}</span>
                  <RemainingTime targetDate={Task.deadline} />
                </div>
              </div>

              <div className="task-actions-bottom-right">
                <PriorityDropdown
                  currentPriority={Task.priority || 4}
                  onSelect={(newPriority) =>
                    handleUpdateTaskPriority(Task.id, newPriority)
                  }
                />
                <button
                  onClick={() => handleDeleteTask(Task.id)}
                  className="delete-btn"
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

  return (
    <div className="pop_up" onClick={onClose}>
      <div className="todo-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-task-btn" onClick={onClose}>
          ✕
        </button>

        <h3 className="search-title">Search Tasks</h3>

        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="task-input"
          />
        </form>

        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-text-container">
                <div className="task-text">{task.text}</div>

                <div className="task-deadline-details">
                  <span className="editable-deadline-container">
                    📅
                    <input
                      type="date"
                      className="hidden-date-input"
                      value={task.deadline || ""}
                      onClick={(e) => e.target.showPicker()}
                      onChange={(e) =>
                        handleUpdateTaskDeadline(task.id, e.target.value)
                      }
                    />
                  </span>
                  <span className="task-deadline-date">{task.deadline}</span>
                  <RemainingTime targetDate={task.deadline} />
                </div>
              </div>
              <div className="task-actions-bottom-right">
                <span className="static-priority-emoji">
                  {task.priority === 1
                    ? "🔴"
                    : task.priority === 2
                      ? "🟠"
                      : task.priority === 3
                        ? "🔵"
                        : "⚪"}
                </span>
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
    <div className="pop_up" onClick={onClose}>
      <div className="todo-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-task-btn" onClick={onClose}>
          ✕
        </button>
        <h3 className="search-title">All Tasks</h3>

        <ul className="task-list">
          {sortedTasks.map((Task) => (
            <li
              key={Task.id}
              className={`task-item ${Task.completed ? "completed-task" : ""}`}
            >
              <div className="task-text-container">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={Task.completed || false}
                  onChange={() => handleToggleComplete(Task.id)}
                />
                <div className="task-text">{Task.text}</div>

                <div className="task-deadline-details">
                  <span className="editable-deadline-container">
                    📅
                    <input
                      type="date"
                      className="hidden-date-input"
                      value={Task.deadline || ""}
                      onClick={(e) => e.target.showPicker()}
                      onChange={(e) =>
                        handleUpdateTaskDeadline(Task.id, e.target.value)
                      }
                    />
                  </span>
                  <span className="task-deadline-date">{Task.deadline}</span>
                  <RemainingTime targetDate={Task.deadline} />
                </div>
              </div>

              <div className="task-actions-bottom-right">
                <PriorityDropdown
                  currentPriority={Task.priority || 4}
                  onSelect={(newPriority) =>
                    handleUpdateTaskPriority(Task.id, newPriority)
                  }
                />
                <button
                  onClick={() => handleDeleteTask(Task.id)}
                  className="delete-btn"
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

  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case 1:
        return "🔴";
      case 2:
        return "🟠";
      case 3:
        return "🔵";
      default:
        return "⚪";
    }
  };

  return (
    <div className="high-priority-container">
      <h2>Top 5 Tasks (By Priority)</h2>
      {topTasks.length === 0 ? (
        <p>No pending tasks added yet!</p>
      ) : (
        <ul className="high-priority-list">
          {topTasks.map((task) => (
            <li key={task.id} className="high-priority-item">
              <span className="priority-emoji">
                {getPriorityEmoji(task.priority)}
              </span>
              <span className="task-text">{task.text}</span>

              <span className="task-deadline-details-inline">
                <span className="editable-deadline-container">
                  📅
                  <input
                    type="date"
                    className="hidden-date-input"
                    value={task.deadline || ""}
                    onClick={(e) => e.target.showPicker()}
                    onChange={(e) =>
                      handleUpdateTaskDeadline(task.id, e.target.value)
                    }
                  />
                </span>
                <span className="task-deadline-date">{task.deadline}</span>
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
    <div className="Search-Button">
      <button className="buttton" onClick={onSearchClick}>
        🔍
      </button>
    </div>
  );
};

const AddButton = ({ onAddTaskClick }) => {
  return (
    <div className="Add-button">
      <button className="buttton" onClick={onAddTaskClick}>
        ➕
      </button>
    </div>
  );
};

const TaskListButton = ({ onTaskListClick }) => {
  return (
    <div className="Task-button">
      <button className="buttton" onClick={onTaskListClick}>
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
    <div className="app-wrapper">
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
