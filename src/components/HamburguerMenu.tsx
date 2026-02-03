import { Button } from "tamagui";
import { Menu } from "@tamagui/menu";
import { Menu as MenuIcon } from "@tamagui/lucide-icons";

export default function HamburguerMenu() {
  return (
    <Menu>
      <Menu.Trigger>
        <Button icon={<MenuIcon />} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content>
          <Menu.Item key="home">
            <Menu.ItemTitle>Home</Menu.ItemTitle>
          </Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}
