interface ButtonGroupProps {
  buttons: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export function ButtonGroup({ buttons }: ButtonGroupProps) {
  return (
    <div className="tweakers-button-group">
      {buttons.map((button, index) => (
        <button
          key={index}
          className="tweakers-button"
          onClick={button.onClick}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
