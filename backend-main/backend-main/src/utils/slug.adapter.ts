import slugify from 'slugify';

interface SlugOptions {
  lowercase?: boolean;
  strict?: boolean;
  replacement?: string;
  locale?: string;
}

export class SlugAdapter {
  static generate(text: string, options: SlugOptions = {}): string {
    return slugify(text, {
      lower: true,
      strict: true,
      ...options,
    });
  }
}
