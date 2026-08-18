"use client";

import React from "react";

const ThemeContext = React.createContext({
  theme: "dark",
  setTheme: () => null,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState("dark");

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
