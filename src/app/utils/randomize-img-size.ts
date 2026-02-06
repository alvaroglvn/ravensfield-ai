export function getRandomImgSize(): number[] {
  const aspectSizes: Record<string, [number, number]> = {
    square: [1024, 1024],
    landscape: [1024, 768],
    portrait: [768, 1024],
  };

  const keys = Object.keys(aspectSizes);
  const chosen = keys[Math.floor(Math.random() * keys.length)];
  const [width, height] = aspectSizes[chosen] ?? [512, 512];

  return [width, height];
}
