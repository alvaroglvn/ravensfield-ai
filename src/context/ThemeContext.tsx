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

// Storage key for persistence
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
  /** Default theme to use before preference is loaded */
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

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>(defaultTheme);
  const [isLoaded, setIsLoaded] = useState(false);

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

  // Load saved preference from storage on mount
  useEffect(() => {
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

    // Persist to storage (fire and forget with error logging)
    AsyncStorage.setItem(THEME_STORAGE_KEY, preference).catch((error) => {
      console.warn("Failed to save theme preference:", error);
    });
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
