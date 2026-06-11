import "./globals.css";

export const metadata = {
  title: "ST Light | Smart Solar Technology",
  description: "Premium corporate prototype for ST Light, Kenya's solar and technology solutions company."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
