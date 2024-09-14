import { FaTrash } from "react-icons/fa";


// eslint-disable-next-line react/prop-types
const IconButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="icon-button">
      <FaTrash />
    </button>
  );
};

export default IconButton;
