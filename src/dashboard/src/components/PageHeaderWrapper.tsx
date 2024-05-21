import type { ReactNode } from 'react';

interface Props {
  title?: ReactNode;
  children: ReactNode;
}

export default function PageHeaderWrapper({ title, children }: Props) {
  return (
    <div>
      {title && <div className="mb-4 text-lg font-medium">{title}</div>}
      <div>{children}</div>
    </div>
  );
}
