import React from "react";
import PropTypes from "prop-types";

/**
 * A customizable button component with theming options.
 *
 * @param {Object} props - The properties object.
 * @param {function} props.onClick - The function to call when the button is clicked.
 * @param {string} [props.type="button"] - The button type (e.g., "button", "submit").
 * @param {string} props.text - The text to display on the button.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {string} [props.theme] - The theme of the button. Can be "default" / "bright" / "alert(outline)".
 *
 * @returns {JSX.Element} The rendered button component.
 */
function DefaultButton({
  onClick,
  type = "button",
  text,
  className = "",
  theme = "default",

  children,
}) {
  const styles = {
    default:
      "px-4 py-2 mt-1 bg-blue-900 text-white rounded-md shadow hover:bg-blue-800 transition",
    bright:
      "px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition",
    alert:
      "px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg shadow hover:bg-red-500 hover:text-white transition",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles[theme]} ${className}`}
    >
      {text}
      {children}
    </button>
  );
}

DefaultButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  text: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  theme: PropTypes.oneOf(["default", "bright", "alert"]),
};

export default DefaultButton;
