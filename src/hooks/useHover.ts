import React from "react";

const useHover = () => {
	const [hovered, setHovered] = React.useState(false);

	const handleMouseEnter = () => setHovered(true);
	const handleMouseLeave = () => setHovered(false);

	return { hovered, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave };
};

export default useHover;
