import React from "react";
import { YStack } from "tamagui";
import { Menu } from "@tamagui/menu";
import { Menu as MenuIcon } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { ThemeToggleBar } from "@/styles/StyledThemeToggle";

const CATEGORIES = [
  { href: "/category/painting", label: "Painting" },
  { href: "/category/sculpture", label: "Sculpture" },
  { href: "/category/drawing", label: "Drawing" },
  { href: "/category/photography", label: "Photography" },
  { href: "/category/objectdart", label: "Objects d'Art" },
  { href: "/category/archaeological-finding", label: "Archaeological Findings" },
];

export default function HamburguerMenu() {
  const router = useRouter();

  return (
    <Menu offset={12}>
      <Menu.Trigger asChild>
        <ThemeToggleBar
          cursor="pointer"
          items="center"
          justify="center"
          pressStyle={{ background: "$color3", scale: 0.95 }}
          hoverStyle={{ background: "$color3" }}
          aria-label="Navigation menu"
        >
          <YStack width={28} height={28} items="center" justify="center">
            <MenuIcon size={16} color="$color12" />
          </YStack>
        </ThemeToggleBar>
      </Menu.Trigger>

      <Menu.Portal zIndex={100}>
        <Menu.Content
          transition="200ms"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$2"
          borderBottomRightRadius="$6"
          borderBottomLeftRadius="$2"
          enterStyle={{ scale: 0.93, opacity: 0, y: -10 }}
          exitStyle={{ scale: 0.97, opacity: 0, y: -5 }}
          boxShadow="0 12px 40px rgba(0,0,0,0.22)"
          paddingBlock="$4"
          paddingInline="$2"
          minWidth={240}
          borderWidth={1}
          borderColor="$borderColor"
        >
          {CATEGORIES.map(({ href, label }, i) => (
            <React.Fragment key={href}>
              {i > 0 && (
                <Menu.Separator
                  marginBlock="$1"
                  marginInline="$4"
                  opacity={0.25}
                />
              )}
              <Menu.Item
                key={href}
                onSelect={() => router.push(href as any)}
                paddingBlock="$3"
                paddingInline="$5"
                cursor="pointer"
                hoverStyle={{ background: "$color3" }}
              >
                <Menu.ItemTitle
                  fontFamily="$heading"
                  fontSize={20}
                  letterSpacing={3}
                  textTransform="none"
                >
                  {label}
                </Menu.ItemTitle>
              </Menu.Item>
            </React.Fragment>
          ))}
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}
