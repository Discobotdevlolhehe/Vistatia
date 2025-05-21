import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const tasks = [
  { value: "directive", label: "Directive (Humane, In-depth)" },
  { value: "assessment", label: "Assessment (Harsh, Brutal, Real)" },
  { value: "strategy", label: "Strategy (Brutal, Realistic Geopolitics)" },
  { value: "rebuttal", label: "Rebuttal (Harsh, Ruthless Diplomacy)" },
  { value: "speech", label: "Speech (Bold, Analytical Factual)" },
  { value: "poipoo", label: "POI-POO (Back up your opposition into a defensive stance)" },
  { value: "guide", label: "Guide (Comprehensive, Detailed Background Guide)" },
];

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

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Merriweather&display=swap";
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResponse("");
    setCopied(false);
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
        body: JSON.stringify({ userId, task, prompt }),
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
            fontFamily: "monospace",
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
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
          maxWidth: 700,
          margin: "3rem auto",
          fontFamily: "'Merriweather', 'Inter', system-ui, sans-serif",
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
            marginBottom: "2rem",
            fontWeight: "800",
            fontSize: "2.6rem",
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.05em",
          }}
        >
          MUN AI Assistant
        </h1>

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
              width: "100%",
              padding: "0.6rem 1rem",
              marginBottom: "1.5rem",
              borderRadius: 6,
              border: `1.5px solid ${theme.inputBorder}`,
              background: theme.inputBg,
              color: theme.text,
              fontSize: "1rem",
              outlineOffset: 2,
              outlineColor: theme.inputFocusBorder,
            }}
            required
          />

          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "0.5rem",
              fontSize: "1rem",
              userSelect: "none",
            }}
            htmlFor="task"
          >
            Choose your task:
          </label>
          <select
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 1rem",
              marginBottom: "1.5rem",
              borderRadius: 6,
              border: `1.5px solid ${theme.inputBorder}`,
              background: theme.inputBg,
              color: theme.text,
              fontSize: "1rem",
              outlineOffset: 2,
              outlineColor: theme.inputFocusBorder,
              cursor: "pointer",
            }}
          >
            {tasks.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

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
              width: "100%",
              padding: "1rem",
              marginBottom: "1.5rem",
              borderRadius: 10,
              border: `1.5px solid ${theme.inputBorder}`,
              background: theme.inputBg,
              color: theme.text,
              fontSize: "1.1rem",
              resize: "vertical",
              fontFamily: "'Inter', sans-serif",
              outlineOffset: 2,
              outlineColor: theme.inputFocusBorder,
            }}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: theme.buttonBg,
              color: "#fff",
              padding: "0.75rem 2rem",
              borderRadius: 10,
              fontWeight: "700",
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
              userSelect: "none",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = theme.buttonHoverBg;
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = theme.buttonBg;
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


