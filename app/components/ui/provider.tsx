import { RouterProvider } from 'react-aria-components';
import { useHref, useNavigate } from 'react-router';

export function UIProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {children}
    </RouterProvider>
  );
}
