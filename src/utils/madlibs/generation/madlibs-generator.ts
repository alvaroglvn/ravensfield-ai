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
  private fluxLoader: DataLoader<string>;
  constructor() {
    const dictPath = path.resolve(
      process.cwd(),
      "src/utils/madlibs/generation/dictionaries",
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
    this.fluxLoader = new DataLoader<string>(
      path.join(dictPath, "flux-descriptors"),
      "flux-descriptors",
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

  public createArtwork(): string {
    const artMovement = this.artLoader.pickRandom();
    const artTheme = this.pickOne(artMovement.themes);
    const artTechnique = this.pickOne(artMovement.techniques);
    const descriptor1 = this.descLoader.pickRandom();
    const descriptor2 = this.descLoader.pickRandom();
    const [fluxDescriptor1, fluxDescriptor2] = [
      this.fluxLoader.pickRandom(),
      this.fluxLoader.pickRandom(),
    ];

    const startArticle = this.getArticle(fluxDescriptor1);

    return `${startArticle} ${fluxDescriptor1} and ${fluxDescriptor2} ${artMovement.name} ${artTheme} ${artTechnique}`;
  }

  public createStory(): string {
    const storySubgenre = this.storyLoader.pickRandom();
    const storyTheme = this.pickOne(storySubgenre.themes);
    const protagonist = this.pickOne(storySubgenre.protagonists);
    const fate = this.pickOne(storySubgenre.fates);
    const ending = this.pickOne(storySubgenre.endings);

    const storyArticle = this.getArticle(storySubgenre.name);
    const protagArticle = this.getArticle(protagonist);

    return `${storyArticle} ${storySubgenre.name} story with a ${storyTheme} theme where ${protagArticle.toLowerCase()} ${protagonist} ${fate} and ultimately ${ending}.
    `
      .replace(/\s+/g, " ")
      .trim();
  }
}
