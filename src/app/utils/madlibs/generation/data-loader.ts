import * as fs from "node:fs";
import * as path from "node:path";

export class DataLoader<T> {
  private items: T[] = [];

  constructor(folderPath: string, rootKey: string) {
    const absoluteFolderPath = path.resolve(folderPath);

    // --- Read and filter files ---
    const files = fs
      .readdirSync(absoluteFolderPath)
      .filter((file) => path.extname(file).toLowerCase() === ".json");

    files.forEach((file) => {
      try {
        const content = fs.readFileSync(
          path.join(absoluteFolderPath, file),
          "utf-8",
        );
        const json = JSON.parse(content);
        const group = json[rootKey];

        if (Array.isArray(group) && group.length > 0) {
          this.items.push(...group);
        }
      } catch (err) {
        console.error(`Skipping ${file}:`, err);
      }
    });
  }

  // --- Helper for readability ---
  private getRandom<K>(arr: K[]): K {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  public pickRandom(): T {
    if (this.items.length === 0) throw new Error("No data loaded.");

    return this.getRandom(this.items);
  }
}
