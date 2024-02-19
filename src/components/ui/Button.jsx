

const Button = ({ label, onClick, color }) => {
  
  const buttonColorClass = color === 'green' ? 'bg-green-500 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-700';

  return (
    <button
      className={`text-white font-medium py-2 px-4 rounded ${buttonColorClass}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
