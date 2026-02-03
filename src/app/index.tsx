import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "tamagui";

export default function Home() {
  const insets = useSafeAreaInsets();

  return <ScrollView></ScrollView>;
}
