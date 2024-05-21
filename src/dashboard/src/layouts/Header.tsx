interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Header({ collapsed, onToggle }: Props) {
  return (
    <div
      style={{
        height: 48,
        background: '#20343e',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <button
        onClick={onToggle}
        className="text-white bg-transparent border-none cursor-pointer text-lg"
      >
        {collapsed ? '☰' : '✕'}
      </button>
    </div>
  );
}
