export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col text-left ${className}`}>
      {label && (
        <label className="mb-1 text-sm text-textSub font-medium">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
        className={`w-full px-4 py-2 rounded-md bg-background border border-surface/70 focus:outline-none focus:ring-1 focus:ring-accent text-textMain placeholder:text-textSub/60 transition-all`}
      />
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}
