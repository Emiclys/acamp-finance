import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "button bg-green text-white",
  secondary: "button bg-gray text-white",
  danger: "button bg-red text-white",
};

const Button: React.FC<CustomButtonProps> = ({
  label,
  onClick = () => {},
  variant = "primary",
  disabled = false,
}) => {
  const baseClasses = "";
  const finalClassName = `${baseClasses} ${variantClasses[variant]}
  ${disabled ? "opacity-50 cursor-default" : ""}`;

  return (
    <button
      type="button"
      className={finalClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
