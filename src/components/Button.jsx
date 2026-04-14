import styles from './Button.module.css';

export default function Button({ children, variant = 'primary', onClick, type = 'button', fullWidth, size = 'md', disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.full : '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
