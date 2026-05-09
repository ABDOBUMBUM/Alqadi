declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "environment-image"?: string;
          "shadow-intensity"?: string;
          exposure?: string;
          loading?: string;
          "camera-orbit"?: string;
        },
        HTMLElement
      >;
    }
  }
}
