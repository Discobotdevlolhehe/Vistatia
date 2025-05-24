import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";

const tasks = [
  { value: "directive", label: "Directive (Humane, In-depth)" },
  { value: "assessment", label: "Assessment (Harsh, Brutal, Real)" },
  { value: "strategy", label: "Strategy (Brutal, Realistic Geopolitics)" },
  { value: "rebuttal", label: "Rebuttal (Harsh, Ruthless Diplomacy)" },
  { value: "speech", label: "Speech (Bold, Analytical Factual)" },
  { value: "poipoo", label: "POI-POO (Back up your opposition into a defensive stance)" },
  { value: "guide", label: "Guide (Comprehensive, Detailed Background Guide)" },
  { value: "draft", label: "Draft Resolutions or Collaboration(Detailed, Structured)" },
  { value: "amendment", label: "Amendments (Detailed, Brutal)" },
];

export function AnimatedDropdown({ value, onChange, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const theme = darkMode
    ? {
      background: "#1e1e1e",
      text: "#eee",
      border: "#444",
      hoverBg: "#333",
      inputBorder: "#444",
      inputBg: "#1e1e1e",
      inputFocusBorder: "rgba(51, 153, 255, 0.9)",
    }
    : {
      background: "#fff",
      text: "#333",
      border: "#ccc",
      hoverBg: "#f0f0f0",
      inputBorder: "#ccc",
      inputBg: "#fff",
      inputFocusBorder: "rgba(0, 123, 255, 0.7)",
    };

  // Handlers for focus/blur shadow effects on button
  function handleFocus(e) {
    e.target.style.boxShadow = darkMode
      ? "0 0 10px rgba(51, 153, 255, 1)"
      : "0 0 10px rgba(0, 123, 255, 0.7)";
  }
  function handleBlur(e) {
    e.target.style.boxShadow = darkMode
      ? "0 0 6px rgba(51, 153, 255, 0.7)"
      : "0 0 6px rgba(0, 123, 255, 0.4)";
  }

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        width: "100%",
        userSelect: "none",
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          width: "95%",
          padding: "0.8rem 1rem",
          marginBottom: "1.5rem",
          borderRadius: "10px",
          border: `2px solid ${theme.inputBorder}`,
          background: theme.inputBg,
          color: theme.text,
          fontSize: "1.1rem",
          fontWeight: "600",
          fontFamily: "'IBM Plex Sans', sans-serif",
          outlineOffset: 2,
          outlineColor: theme.inputFocusBorder,
          cursor: "pointer",
          boxShadow: darkMode
            ? "0 0 6px rgba(51, 153, 255, 0.7)"
            : "0 0 6px rgba(0, 123, 255, 0.4)",
          transition: "all 0.3s ease",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {tasks.find((t) => t.value === value)?.label || "Select a task"}
        <span style={{ marginLeft: "auto" }}>{isOpen ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            tabIndex={-1}
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              margin: 0,
              padding: 0,
              listStyle: "none",
              background: theme.background,
              border: `1.5px solid ${theme.border}`,
              borderRadius: 6,
              maxHeight: 200,
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            {tasks.map(({ value: val, label }) => (
              <li
                key={val}
                role="option"
                aria-selected={val === value}
                onClick={() => {
                  onChange(val);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onChange(val);
                    setIsOpen(false);
                  }
                }}
                tabIndex={0}
                style={{
                  padding: "0.6rem 1rem",
                  cursor: "pointer",
                  backgroundColor: val === value ? theme.hoverBg : "transparent",
                  color: theme.text,
                  fontWeight: val === value ? "700" : "400",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.hoverBg)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = val === value ? theme.hoverBg : "transparent")
                }
              >
                {label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [userId, setUserId] = useState("");
  const [task, setTask] = useState("directive");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const promptRef = useRef(null);
  const [searchId, setSearchId] = useState("");
  const [userData, setUserData] = useState(null);
  const inputRef = useRef(null);
  const [amendmentInput, setAmendmentInput] = useState("");
  const [amendments, setAmendments] = useState(() => {
    const stored = localStorage.getItem("amendments");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("amendments", JSON.stringify(amendments));
  }, [amendments]);

  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddAmendment();
      }
    };

    inputEl.addEventListener("keydown", handleKeyDown);
    return () => inputEl.removeEventListener("keydown", handleKeyDown);
  }, [amendmentInput]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Merriweather&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=IBM+Plex+Sans:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);



  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#fff";
    document.body.style.color = darkMode ? "#eee" : "#333";
  }, [darkMode]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.key === "Enter") {
        handleSubmit(new Event("submit", { bubbles: true, cancelable: true }));
      } else if (e.key === "Escape") {
        setPrompt("");
        setError("");
      } else if (e.altKey && e.key.toLowerCase() === "s") {
        setDarkMode((d) => !d);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prompt, darkMode]);

  useEffect(() => {
    if (!loading && response && promptRef.current) {
      promptRef.current.focus();
    }
  }, [loading, response]);

  const handleAddAmendment = () => {
    if (typeof amendmentInput !== "string") {
      console.error("amendmentInput is not a string:", amendmentInput);
      return;
    }

    const trimmed = amendmentInput.trim();
    if (trimmed === "") return;

    const newAmendment = { amendmentPrompt: trimmed };
    setAmendments((prev) => [...prev, newAmendment]);
    setAmendmentInput("");
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:4000/userdata/${searchId}`);
      if (!res.ok) throw new Error("User ID not found");
      const data = await res.json();
      setUserData(data);
      setError(null);
    } catch (err) {
      setUserData(null);
      setError(err.message);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResponse("");
    setCopied(false);

    const amendmentPrompt = amendments.map((a) => a.amendmentPrompt).join("\n");

    if (!userId.trim()) {
      setError(
        "Seriously? Jesus Fucking Christ, I’m taking the effort to remember your sorry ass, put that damn user ID in."
      );
      return;
    }
    if (!prompt.trim()) {
      setError(
        "Do you really expect me to carry you to Best Delegate and that cash prize? Life’s a bitch, honey. Tell me what to do — you won’t get this opportunity with your GF in bed anyways."
      );
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, task, prompt, amendmentPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setResponse(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const colors = {
    light: {
      background: "#fff",
      text: "#333",
      inputBg: "#fff",
      inputBorder: "#ccc",
      inputFocusBorder: "#007bff",
      buttonBg: "#007bff",
      buttonHoverBg: "#0056b3",
      errorBg: "#fddede",
      errorText: "#b00020",
      responseBg: "#f7f9fc",
      responseText: "#222",
      copyBtnBg: "#007bff",
      copyBtnHoverBg: "#0056b3",
    },
    dark: {
      background: "#121212",
      text: "#eee",
      inputBg: "#1e1e1e",
      inputBorder: "#444",
      inputFocusBorder: "#3399ff",
      buttonBg: "#3399ff",
      buttonHoverBg: "#007acc",
      errorBg: "#440000",
      errorText: "#ff6666",
      responseBg: "#222",
      responseText: "#eee",
      copyBtnBg: "#3399ff",
      copyBtnHoverBg: "#007acc",
    },
  };

  const theme = darkMode ? colors.dark : colors.light;

  // Custom renderer for code blocks to enable syntax highlighting
  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={darkMode ? oneDark : oneLight}
          language={match[1]}
          PreTag="div"
          {...props}
          showLineNumbers
          wrapLongLines
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className={className}
          style={{
            backgroundColor: theme.responseBg,
            padding: "0.2em 0.4em",
            borderRadius: 4,
            fontSize: "0.95em",
            fontFamily: "Cormorant Garamond', 'sans-serif'",
          }}
          {...props}
        >
          {children}'
        </code>
      );
    },
  };;

  const renderTaskDetails = (item) => {
    return (
      <ul className="mt-2 space-y-3 pl-4 text-gray-900 font-sans">
        {Object.entries(item).map(([key, value]) => {
          if (!value) return null;
          return (
            <li key={key} className="border-l-4 border-blue-400 pl-3">
              <p className="font-semibold capitalize mb-1">{key}:</p>
              <div className="prose max-w-none">
                <ReactMarkdown>{value}</ReactMarkdown>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };


  function handleCopy() {
    navigator.clipboard.writeText(response).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 50,
          left: 20,
          width: 240,
          padding: 15,
          transition: "all 0.4s ease",
          backgroundColor: darkMode ? "rgba(30, 30, 30, 0.9)" : "#f0f0f0",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          fontFamily: "'IBM Plex Sans', sans-serif",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            marginBottom: 10,
            fontWeight: "600",
            fontSize: 16,
            lineHeight: 1.2,
          }}
        >
          Note Down Amendments
        </h2>

        <div style={{ display: "flex", marginBottom: 10 }}>
          <input
            type="text"
            ref={inputRef}
            value={amendmentInput}
            onChange={(e) => setAmendmentInput(e.target.value)}
            placeholder="Add a short point..."
            style={{
              flex: 1,
              padding: "5px 8px",
              fontSize: 12,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontFamily: "'IBM Plex Sans', sans-serif",
              background: "transparent",
              boxSizing: "border-box",
              color: theme.text,
            }}
          />
          <button
            onClick={() =>
              handleAddAmendment(amendmentInput, setAmendmentInput, setAmendments)
            }
            style={{
              marginLeft: 6,
              padding: "4px 10px",
              fontSize: 18,
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#0070f3",
              color: "white",
              fontFamily: "'IBM Plex Sans', sans-serif",
              lineHeight: 1,
            }}
            aria-label="Add amendment"
          >
            +
          </button>
        </div>

        <ul
          className="amendments-scorllbar"
          style={{
            paddingLeft: 0,
            marginTop: 0,
            maxHeight: amendments.length >= 3 ? 90 : "auto",
            overflowY: amendments.length >= 3 ? "auto" : "visible",
            fontSize: 13,
            lineHeight: 1.3,
            listStyleType: "none",
          }}
        >
          {amendments.map((item, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
                paddingRight: 4,
              }}
            >
              <span>{item.amendmentPrompt}</span>
              <button
                onClick={() =>
                  setAmendments((prev) => prev.filter((_, i) => i !== index))
                }
                style={{
                  marginLeft: 6,
                  padding: "0 6px",
                  fontSize: 12,
                  cursor: "pointer",
                  borderRadius: 4,
                  backgroundColor: "#f44336",
                  border: "none",
                  color: "white",
                  fontWeight: "bold",
                }}
                aria-label="Remove amendment"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {amendments.length > 0 && (
          <button
            onClick={() => setAmendments([])}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "6px 0",
              fontSize: 12,
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#222",
              color: "white",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            Clear All
          </button>
        )}
      </div>
      <div
        style={{
          maxWidth: 700,
          margin: "3rem auto",
          fontFamily: "'IBM Plex Sans', serif",
          fontWeight: "600",
          padding: "2rem",
          color: theme.text,
          background: darkMode
            ? "rgba(30, 30, 30, 0.9)"
            : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          borderRadius: "20px",
          transition: "all 0.4s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: darkMode ? "#222" : "#eee",
            border: "2px solid " + theme.text,
            color: theme.text,
            borderRadius: 20,
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: 14,
            transition: "all 0.3s ease",
            userSelect: "none",
          }}
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>



        <h1
          style={{
            textAlign: "center",
            marginBottom: "0.1rem",
            fontWeight: "800",
            fontSize: "2.6rem",
            fontFamily: "'Cormorant Garamond', serif",
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.05em",
            display: "flex",            // ⬅️ makes text and image inline
            justifyContent: "center",   // ⬅️ center contents
            alignItems: "center",       // ⬅️ vertically align image with text
            gap: "0.8rem",              // ⬅️ spacing between image and text
          }}
        >
          <img
            src="/mun.png"
            alt="MUN Logo"
            style={{ width: "50px", height: "50px" }}
          />
          Vistatia
          <img
            src="/mun.png"
            alt="MUN Logo"
            style={{ width: "50px", height: "50px" }}
          />
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: "1.2rem",
            fontFamily: "'Cormorant Garamond', serif",
            color: darkMode ? "#ccc" : "#555",
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "2rem",
            fontWeight: "700",
            letterSpacing: "0.03rem",
          }}
        >
          I won’t Sugarcoat, Neither Should You
        </p>


        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          {/* Your inputs here (userId, task, prompt) — unchanged */}

          {/* Copy pasted inputs from your original code for brevity */}
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "0.5rem",
              fontSize: "1rem",
              userSelect: "none",
            }}
            htmlFor="userId"
          >
            Your User ID (any unique string):
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g., delegate123"
            style={{
              width: "90%",
              padding: "0.8rem 1rem",
              marginBottom: "1.5rem",
              borderRadius: "10px",
              border: `2px solid ${theme.inputBorder}`,
              background: theme.inputBg,
              color: theme.text,
              fontSize: "1.1rem",
              fontWeight: "600",
              fontFamily: "'IBM Plex Sans', sans-serif",
              outlineOffset: 2,
              outlineColor: theme.inputFocusBorder,
              cursor: "text",
              boxShadow: darkMode
                ? "0 0 6px rgba(51, 153, 255, 0.7)"
                : "0 0 6px rgba(0, 123, 255, 0.4)",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) =>
            (e.target.style.boxShadow = darkMode
              ? "0 0 10px rgba(51, 153, 255, 1)"
              : "0 0 10px rgba(0, 123, 255, 0.7)")
            }
            onBlur={(e) =>
            (e.target.style.boxShadow = darkMode
              ? "0 0 6px rgba(51, 153, 255, 0.7)"
              : "0 0 6px rgba(0, 123, 255, 0.4)")
            }
          //required
          />



          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "0.5rem",
              fontSize: "1rem",
              userSelect: "none",
            }
            }
            htmlFor="task"
          >
            Choose your task:
          </label>
          <AnimatedDropdown
            value={task}
            onChange={setTask}
            darkMode={darkMode}
          />



          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "0.5rem",
              fontSize: "1rem",
              userSelect: "none",
            }}
            htmlFor="prompt"
          >
            Your prompt:
          </label>

          <textarea
            id="prompt"
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tell the AI what to do..."
            style={{
              width: "90%",
              padding: "1rem",
              marginBottom: "1.5rem",
              borderRadius: "10px",
              border: `2px solid ${theme.inputBorder}`,
              background: theme.inputBg,
              color: theme.text,
              fontSize: "1.1rem",
              fontWeight: "600",
              fontFamily: "'IBM Plex Sans', sans-serif",
              resize: "vertical",
              outlineOffset: 2,
              outlineColor: theme.inputFocusBorder,
              boxShadow: darkMode
                ? "0 0 6px rgba(51, 153, 255, 0.7)"
                : "0 0 6px rgba(0, 123, 255, 0.4)",
              transition: "all 0.3s ease",
              cursor: "text",
            }}
            onFocus={(e) =>
            (e.target.style.boxShadow = darkMode
              ? "0 0 10px rgba(51, 153, 255, 1)"
              : "0 0 10px rgba(0, 123, 255, 0.7)")
            }
            onBlur={(e) =>
            (e.target.style.boxShadow = darkMode
              ? "0 0 6px rgba(51, 153, 255, 0.7)"
              : "0 0 6px rgba(0, 123, 255, 0.4)")
            }
          //required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: theme.buttonBg,
              color: "#fff",
              padding: "0.75rem 2rem",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
              userSelect: "none",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              boxShadow: darkMode
                ? "0 0 6px rgba(51, 153, 255, 0.7)"
                : "0 0 6px rgba(0, 123, 255, 0.4)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = theme.buttonHoverBg;
                e.currentTarget.style.boxShadow = darkMode
                  ? "0 0 10px rgba(51, 153, 255, 1)"
                  : "0 0 10px rgba(0, 123, 255, 0.7)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = theme.buttonBg;
                e.currentTarget.style.boxShadow = darkMode
                  ? "0 0 6px rgba(51, 153, 255, 0.7)"
                  : "0 0 6px rgba(0, 123, 255, 0.4)";
              }
            }}
          >
            {loading ? "Thinking..." : "Generate"}
          </button>

        </form>

        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: theme.errorBg,
              color: theme.errorText,
              padding: "1rem",
              borderRadius: 8,
              fontWeight: "700",
              marginBottom: "2rem",
              userSelect: "text",
            }}
          >
            {error}
          </div>
        )}

        {response && (
          <div
            style={{
              position: "relative",
              width: "auto",
              backgroundColor: theme.responseBg,
              color: theme.responseText,
              borderRadius: 20,
              padding: "1.8rem 2rem 2rem 2rem",
              fontSize: "1.05rem",
              lineHeight: "1.6",
              boxShadow: darkMode
                ? "0 0 15px rgba(50, 150, 255, 0.4)"
                : "0 0 12px rgba(0, 123, 255, 0.25)",
              maxHeight: "50vh",
              overflowY: "auto",
              userSelect: "text",
              animation: "fadeIn 0.6s ease",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <button
              onClick={handleCopy}
              title="Copy response to clipboard"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: theme.copyBtnBg,
                color: "#fff",
                border: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: 14,
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.85rem",
                userSelect: "none",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.copyBtnHoverBg)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = theme.copyBtnBg)
              }
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <ReactMarkdown
              children={response}
              remarkPlugins={[remarkGfm]}
              components={renderers}
            />
          </div>
        )}

        <section className="bg-gray-50 p-6 rounded shadow-md border">
          <h2 className="text-2xl font-extrabold mb-5 border-b border-gray-400 pb-2">
            Search User Tasks
          </h2>

          <div style={{ position: "relative", maxWidth: 600, marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Enter User ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchId, setUserData, setError)}
              style={{
                width: "100%",
                borderRadius: 6,
                padding: "12px 40px 12px 16px", // extra right padding for clear button
                fontSize: 18,
                color: darkMode ? "#E5E7EB" : "#374151",
                backgroundColor: "transparent",
                boxShadow: darkMode
                  ? "0 0 15px rgba(50, 150, 255, 0.4)"
                  : "0 0 12px rgba(0, 123, 255, 0.25)",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onFocus={e => (e.target.style.borderColor = "#3B82F6")}
              onBlur={e => (e.target.style.borderColor = "#D1D5DB")}
            />

            {searchId && (
              <button
                onClick={() => {
                  setSearchId("");
                  setUserData(null);
                  setError(null);
                }}
                aria-label="Clear search"
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 20,
                  fontWeight: "bold",
                  color: darkMode ? "white" : "grey",
                  userSelect: "none",
                  lineHeight: 1,
                }}
                onMouseEnter={e => e.currentTarget.style.color = darkMode ? "#ddd" : "#555"}
                onMouseLeave={e => e.currentTarget.style.color = darkMode ? "white" : "grey"}
              >
                X
              </button>
            )}
          </div>

          <button
            onClick={() => handleSearch(searchId, setUserData, setError)}
            type="button"
            style={{
              backgroundColor: "#2563EB",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 6,
              fontSize: 18,
              fontWeight: 600,
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              border: "none",
              cursor: "pointer",
              outline: "none",
              transition: "background-color 0.2s ease, box-shadow 0.2s ease",
              marginLeft: 12,
              height: "48px",
            }}
            onMouseEnter={e => (e.target.style.backgroundColor = "#1D4ED8")}
            onMouseLeave={e => (e.target.style.backgroundColor = "#2563EB")}
            onFocus={e => (e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.5)")}
            onBlur={e => (e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)")}
          >
            Search
          </button>



          {error && <p className="text-red-600 font-semibold">{error}</p>}

          {userData && (
            <div className="space-y-8">
              {Object.entries(userData).map(([taskType, tasks]) => (
                <div key={taskType}>
                  <h3 className="text-xl font-semibold capitalize mb-4 border-b border-gray-300 pb-1">
                    {taskType}
                  </h3>

                  {tasks.length === 0 ? (
                    <p className="text-gray-500 italic">No entries found.</p>
                  ) : (
                    tasks.map((item, idx) => (
                      <details
                        key={idx}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #e5e7eb", // Tailwind's gray-300
                          borderRadius: "0.5rem",
                          padding: "1.25rem",
                          marginBottom: "2rem", // more spacing between items
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <summary
                          style={{
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "1.125rem", // text-lg
                          }}>
                          Task {idx + 1}
                        </summary>

                        {/* Scrollable container */}
                        <div
                          style={{
                            maxHeight: "250px",
                            overflowY: "auto",
                            marginTop: "1rem",
                            paddingRight: "0.5rem",
                            paddingBottom: "0.25rem",
                          }}
                          className="pr-2"
                        >
                          {/* Markdown support here */}
                          {renderTaskDetails(item)}
                        </div>
                      </details>
                    ))
                  )}
                </div>
              ))}
            </div>
          )}
        </section>




        <style>{`
          @keyframes fadeIn {
            from {opacity: 0; transform: translateY(8px);}
            to {opacity: 1; transform: translateY(0);}
          }
          /* Scrollbar styling */
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: ${darkMode ? "#121212" : "#eee"};
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb {
            background-color: ${darkMode ? "#3399ff" : "#007bff"};
            border-radius: 10px;
          }
        `}</style>



      </div>


    </>
  );
}