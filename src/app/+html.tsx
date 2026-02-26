import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

// Inline script to set theme class before React hydration (prevents flash)
const themeScript = `
(function() {
  var stored = localStorage.getItem('ravensfield-theme-preference');
  var theme = stored || 'system';
  if (theme === 'system') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.classList.add('t_' + theme);
})();
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: var(--background, #0D131F);
  transition: background-color 0.2s ease;
}
`;
