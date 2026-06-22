import "./globals.css";

export const metadata = {
  title: "ST Light | Smart Solar Technology & Intelligence",
  description: "ST Light's solar technology website and private business intelligence warehouse."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
