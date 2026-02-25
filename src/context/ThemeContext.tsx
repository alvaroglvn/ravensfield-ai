import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useColorScheme as useDeviceColorScheme, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Theme preference types
export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

// Storage key for persistence — must match the key used in +html.tsx
const THEME_STORAGE_KEY = "ravensfield-theme-preference";

// Context value type
type ThemeContextValue = {
  /** User's theme preference (light, dark, or system) */
  themePreference: ThemePreference;
  /** The actual resolved theme being used (light or dark) */
  resolvedTheme: ResolvedTheme;
  /** Update the theme preference */
  setThemePreference: (preference: ThemePreference) => void;
  /** Whether the theme has been loaded from storage */
  isLoaded: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
  /** Default theme to use when no preference has been stored yet */
  defaultTheme?: ThemePreference;
};

// Helper to update the root theme class on web for CSS variable switching
function updateRootThemeClass(theme: ResolvedTheme) {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    const root = document.documentElement;
    root.classList.remove("t_light", "t_dark");
    root.classList.add(`t_${theme}`);
  }
}

// Read theme preference synchronously from localStorage on web.
// This matches exactly what the +html.tsx inline script reads, so the
// CSS class set before React loads and the initial React state are always
// in sync — eliminating the flash caused by the async AsyncStorage read.
function getInitialTheme(defaultTheme: ThemePreference): ThemePreference {
  if (Platform.OS === "web" && typeof localStorage !== "undefined") {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && ["light", "dark", "system"].includes(stored)) {
        return stored as ThemePreference;
      }
    } catch {
      // localStorage unavailable (private browsing, quota exceeded, etc.)
    }
  }
  return defaultTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>(() => getInitialTheme(defaultTheme));

  // On web the sync read above is already authoritative; no async load needed.
  // On native we still need to wait for AsyncStorage.
  const [isLoaded, setIsLoaded] = useState(Platform.OS === "web");

  // Get device color scheme
  const deviceColorScheme = useDeviceColorScheme();

  // Resolve the actual theme based on preference
  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    if (themePreference === "system") {
      return deviceColorScheme === "dark" ? "dark" : "light";
    }
    return themePreference;
  }, [themePreference, deviceColorScheme]);

  // Update root theme class when resolved theme changes (for web CSS variables)
  useEffect(() => {
    updateRootThemeClass(resolvedTheme);
  }, [resolvedTheme]);

  // Load saved preference from storage on mount (native only)
  useEffect(() => {
    if (Platform.OS === "web") return; // already loaded synchronously above

    async function loadThemePreference() {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          savedPreference &&
          ["light", "dark", "system"].includes(savedPreference)
        ) {
          setThemePreferenceState(savedPreference as ThemePreference);
        }
      } catch (error) {
        console.warn("Failed to load theme preference:", error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadThemePreference();
  }, []);

  // Save preference to storage whenever it changes
  const setThemePreference = useCallback((preference: ThemePreference) => {
    setThemePreferenceState(preference);

    if (Platform.OS === "web") {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, preference);
      } catch {
        // localStorage unavailable — ignore
      }
    } else {
      AsyncStorage.setItem(THEME_STORAGE_KEY, preference).catch((error) => {
        console.warn("Failed to save theme preference:", error);
      });
    }
  }, []);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      themePreference,
      resolvedTheme,
      setThemePreference,
      isLoaded,
    }),
    [themePreference, resolvedTheme, setThemePreference, isLoaded],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
