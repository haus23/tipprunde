import { ReactNode } from 'react';

type ContentPanelProps = {
  title: ReactNode;
  children?: ReactNode;
};

const ContentPanel = ({ title, children }: ContentPanelProps) => (
  <div>
    <div className="px-4 h-14 md:h-16 absolute md:static top-0 left-10 sm:left-12 z-20 md:border-b border-gray-300 dark:border-gray-700 flex items-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
    <div className="py-4 px-4 md:px-8">{children}</div>
  </div>
);

export default ContentPanel;
