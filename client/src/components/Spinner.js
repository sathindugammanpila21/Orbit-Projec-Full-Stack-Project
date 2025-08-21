import React from "react";
import PropTypes from "prop-types";

/**
 * Full-screen Spinner component
 * Customizable size, border color, overlay color, and z-index.
 */
function Spinner({
  size = 40,
  borderColor = "border-gray-200",
  overlayColor = "bg-black",
  overlayOpacity = "opacity-70",
  zIndex = "z-[9999]",
}) {
  return (
    <div
      className={`fixed inset-0 ${overlayColor} ${overlayOpacity} flex items-center justify-center ${zIndex}`}
    >
      <div
        className={`border-4 border-solid ${borderColor} border-t-transparent rounded-full animate-spin`}
        style={{ height: size, width: size }}
      ></div>
    </div>
  );
}

Spinner.propTypes = {
  size: PropTypes.number,
  borderColor: PropTypes.string,
  overlayColor: PropTypes.string,
  overlayOpacity: PropTypes.string,
  zIndex: PropTypes.string,
};

export default Spinner;

