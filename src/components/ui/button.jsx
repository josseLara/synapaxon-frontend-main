export const Button = ({ children, className = '', variant = 'default', size = 'default', onClick, ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none  disabled:opacity-50 disabled:pointer-events-none';
    
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-sm',
      lg: 'h-12 px-6'
    };
    
    return (
      <button 
        className={`${baseClasses} ${sizes[size]} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  };