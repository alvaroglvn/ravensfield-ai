import { RibbonWrapper, RibbonBadge, RibbonLabel } from "@/styles/StyledRibbon";

interface RibbonProps {
  label?: string;
}

export function Ribbon({ label = "New" }: RibbonProps) {
  return (
    <RibbonWrapper>
      <RibbonBadge>
        <RibbonLabel>{label}</RibbonLabel>
      </RibbonBadge>
    </RibbonWrapper>
  );
}
