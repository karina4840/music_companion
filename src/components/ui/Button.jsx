import React from "react";
import Icon from "../AppIcon";

const Button = ({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
  type = "button",
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary hover:bg-primary-hover text-white focus:ring-primary disabled:bg-text-disabled disabled:text-text-secondary";
      case "secondary":
        return "bg-surface hover:bg-surface-alt text-text-primary border border-border focus:ring-border disabled:bg-surface disabled:text-text-disabled disabled:border-text-disabled";
      case "ghost":
        return "text-text-secondary hover:text-text-primary hover:bg-surface-alt focus:ring-border disabled:text-text-disabled disabled:hover:bg-transparent";
      case "icon":
        return "text-text-secondary hover:text-text-primary hover:bg-surface-alt focus:ring-border disabled:text-text-disabled disabled:hover:bg-transparent p-2";
      case "spotify-connect":
        return "bg-spotify hover:bg-green-600 text-white focus:ring-spotify disabled:bg-text-disabled disabled:text-text-secondary";
      case "danger":
        return "bg-red-500 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-text-disabled disabled:text-text-secondary";
      default:
        return "bg-primary hover:bg-primary-hover text-white focus:ring-primary disabled:bg-text-disabled disabled:text-text-secondary";
    }
  };

  const getSizeClasses = () => {
    if (variant === "icon") {
      switch (size) {
        case "small":
          return "p-1";
        case "large":
          return "p-3";
        default:
          return "p-2";
      }
    }

    switch (size) {
      case "small":
        return "px-3 py-1.5 text-sm";
      case "large":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg 
    transition-all duration-200 focus:outline-none focus:ring-2 
    focus:ring-offset-2 focus:ring-offset-background
    disabled:cursor-not-allowed disabled:opacity-50
  `;

  const classes = `${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`;

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const renderIcon = (position) => {
    if (!icon || iconPosition !== position) return null;

    const iconSize = size === "small" ? 16 : size === "large" ? 24 : 20;

    return (
      <Icon
        name={icon}
        size={iconSize}
        className={
          variant === "icon" ? "" : position === "left" ? "mr-2" : "ml-2"
        }
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      const spinnerSize = size === "small" ? 16 : size === "large" ? 24 : 20;
      return (
        <>
          <Icon
            name="Loader2"
            size={spinnerSize}
            className={`animate-spin ${children ? "mr-2" : ""}`}
          />
          {children}
        </>
      );
    }

    if (variant === "icon") {
      return renderIcon("left");
    }

    return (
      <>
        {renderIcon("left")}
        {children}
        {renderIcon("right")}
      </>
    );
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
