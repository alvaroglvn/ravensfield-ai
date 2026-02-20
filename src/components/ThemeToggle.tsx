import { XStack, Button, useThemeName } from "tamagui";
import { Sun, Moon, Monitor } from "@tamagui/lucide-icons";
import { useTheme, type ThemePreference } from "@/context/ThemeContext";

type ThemeOption = {
  value: ThemePreference;
  icon: typeof Sun;
  label: string;
};

const themeOptions: ThemeOption[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

export default function ThemeToggle() {
  const { themePreference, setThemePreference } = useTheme();
  const themeName = useThemeName();

  return (
    <XStack
      gap="$1"
      paddingBlock={4}
      paddingInline={4}
      r={8}
      borderWidth={1}
      borderColor="rgba(128, 128, 128, 0.3)"
    >
      {themeOptions.map(({ value, icon: Icon, label }) => {
        const isActive = themePreference === value;

        return (
          <Button
            key={value}
            size="$2"
            circular
            background={isActive ? "$color5" : "transparent"}
            pressStyle={{
              background: isActive ? "$color6" : "$color3",
              scale: 0.95,
            }}
            hoverStyle={{
              background: isActive ? "$color5" : "$color3",
            }}
            onPress={() => setThemePreference(value)}
            aria-label={label}
            aria-pressed={isActive}
            icon={<Icon size={16} color={isActive ? "$color12" : "$color10"} />}
          />
        );
      })}
    </XStack>
  );
}
