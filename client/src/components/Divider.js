import React from "react";
import PropTypes from "prop-types";

/**
 * Divider component
 * Allows customization of height, color, and margin.
 */
function Divider({ height = "1px", color = "bg-gray-400", margin = "my-2" }) {
  return <div className={`${margin} ${color}`} style={{ height }} />;
}

Divider.propTypes = {
  height: PropTypes.string,
  color: PropTypes.string,
  margin: PropTypes.string,
};

export default Divider;

