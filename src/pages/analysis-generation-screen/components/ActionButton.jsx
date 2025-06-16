import React from "react";
import Icon from "../../../components/AppIcon";

const ActionButton = ({
  onClick,
  disabled,
  loading,
  children,
  variant = "primary",
  icon,
  className = "",
}) => {
  const getButtonClasses = () => {
    const baseClasses =
      "flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

    switch (variant) {
      case "secondary":
        return `${baseClasses} bg-surface hover:bg-surface-alt text-text-primary border border-border focus:ring-border`;
      case "ghost":
        return `${baseClasses} text-text-secondary hover:text-text-primary hover:bg-surface-alt focus:ring-border`;
      default:
        return `${baseClasses} bg-primary hover:bg-primary-hover text-white focus:ring-primary`;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${getButtonClasses()} ${className}`}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {icon && <Icon name={icon} size={20} />}
          {children}
        </>
      )}
    </button>
  );
};

export default ActionButton;
