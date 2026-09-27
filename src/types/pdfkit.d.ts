declare module "pdfkit" {
  export default class PDFDocument {
    constructor(options?: Record<string, unknown>);
    registerFont(name: string, file: string): void;
    rect(x: number, y: number, w: number, h: number): { fill: (color?: string) => this };
    fillColor(color: string): this;
    font(name: string): this;
    fontSize(size: number): this;
    text(text: string, x?: number, y?: number, options?: Record<string, unknown>): this;
    circle(x: number, y: number, r: number): { fillColor: (color: string) => { fill: () => this } };
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    lineWidth(width: number): this;
    strokeColor(color: string): this;
    stroke(): this;
    fill(color?: string): this;
    end(): void;
    on(event: "data", listener: (chunk: Buffer) => void): this;
    on(event: "end", listener: () => void): this;
    on(event: "error", listener: (err: unknown) => void): this;
    info: {
      Title?: string;
      Author?: string;
      Subject?: string;
      Creator?: string;
    };
  }
}
