import * as path from "node:path";
import { DataLoader } from "@/utils/madlibs/generation/data-loader";

interface ArtMovement {
  name: string;
  themes: string[];
  techniques: string[];
}

interface StorySubgenre {
  name: string;
  themes: string[];
  protagonists: string[];
  fates: string[];
  endings: string[];
}

export class MadlibsGenerator {
  private artLoader: DataLoader<ArtMovement>;
  private storyLoader: DataLoader<StorySubgenre>;
  private descLoader: DataLoader<string>;

  constructor() {
    const dictPath = path.resolve(
      process.cwd(),
      "src/app/utils/madlibs/dictionaries",
    );

    this.artLoader = new DataLoader<ArtMovement>(
      path.join(dictPath, "artworks"),
      "movements",
    );
    this.storyLoader = new DataLoader<StorySubgenre>(
      path.join(dictPath, "storytelling"),
      "subgenres",
    );
    this.descLoader = new DataLoader<string>(
      path.join(dictPath, "descriptors"),
      "descriptors",
    );
  }

  private pickOne(arr: string[]): string {
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
      console.warn("⚠️ Warning: Found an entry with missing data!");
      return "UNKNOWN_DATA";
    }
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private getArticle(word: string): string {
    return /^[aeiou]/i.test(word) ? "An" : "A";
  }

  public createPrompt(): string {
    const artCtx = this.artLoader.pickRandom();
    const storyCtx = this.storyLoader.pickRandom();

    const desc1 = this.descLoader.pickRandom();
    const desc2 = this.descLoader.pickRandom();

    const artTheme = this.pickOne(artCtx.themes);
    const artObject = this.pickOne(artCtx.techniques);

    const storyTheme = this.pickOne(storyCtx.themes);
    const storyProtag = this.pickOne(storyCtx.protagonists);
    const storyFate = this.pickOne(storyCtx.fates);
    const storyEnding = this.pickOne(storyCtx.endings);

    const startArticle = this.getArticle(desc1);
    const storyArticle = this.getArticle(storyCtx.name);
    const protagArticle = this.getArticle(storyProtag);

    return `
      ${startArticle} ${desc1} and ${desc2} ${
        artCtx.name
      } ${artTheme} ${artObject}. 
      This artwork carries ${storyArticle.toLowerCase()} ${
        storyCtx.name
      } story with a ${storyTheme} theme 
      where ${protagArticle.toLowerCase()} ${storyProtag} ${storyFate} 
      and ultimately ${storyEnding}.
    `
      .replace(/\s+/g, " ")
      .trim();
  }
}
