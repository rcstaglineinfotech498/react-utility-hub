import { createElement } from "react";
import { LoaderCircle, Search, X } from "lucide-react";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, ...props }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <input className="input" {...props} />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <select className="input" {...props}>
        {children}
      </select>
    </label>
  );
}

export function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}
export function Loader({ text = "Loading..." }) {
  return (
    <div className="state">
      <LoaderCircle className="spin" size={24} />
      <span>{text}</span>
    </div>
  );
}
export function ErrorMessage({ children }) {
  return (
    <div className="notice notice-error">
      <X size={18} />
      {children}
    </div>
  );
}
export function EmptyState({
  icon = Search,
  title = "Nothing here yet",
  children,
}) {
  return (
    <div className="empty">
      {createElement(icon, { size: 28 })}
      <strong>{title}</strong>
      {children && <span>{children}</span>}
    </div>
  );
}
