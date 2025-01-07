import "./globals.css";
import Navigation from "./components/Navigation";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>PokéApp</title>
      </head>
      <body>
        <header>
          <h1>PokéApp</h1>
        </header>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
