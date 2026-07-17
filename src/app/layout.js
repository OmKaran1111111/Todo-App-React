import { ClerkProvider } from '@clerk/nextjs';
import './globals.css'; 

export const metadata = {
  title: 'todo-app',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}