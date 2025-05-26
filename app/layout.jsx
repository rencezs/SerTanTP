import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: 'All Off',
  description: 'Your premier destination for urban streetwear and fashion',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/copy/Picsart_23-04-27_15-55-05-831.png" />
        </head>
        <body className={`antialiased text-gray-700`}>
          <AppContextProvider>
            <Toaster />
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  )
} 