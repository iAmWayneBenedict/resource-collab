import  { useEffect, useRef, useState } from "react";

type TObserveElement = Window | HTMLElement | null;
type TSize = { height: number; width: number };

type TUseElementSizeResult = {
	size: TSize;
	observeElement: TObserveElement;
	setObserveElement: (el: HTMLElement) => void;
};

/**
 * Description placeholder
 * @date 2/27/2024 - 9:57:33 AM
 *
 * @param {TObserveElement} target - Description target to be observed
 * @returns {TUseElementSizeResult} Description returns the element size and the observe element
 *
 */
const useElementSize = (target?: TObserveElement): TUseElementSizeResult => {
	const [elementSize, setElementSize] = useState<TSize>({
		height: 0,
		width: 0,
	});
	const observeElement = useRef<TObserveElement>(target || null);

	const setObserveElement = (el: HTMLElement) => {
		observeElement.current = el;
	};

	const resizeHandler = (e: UIEvent) => {
		if (!observeElement.current) return;

		if (observeElement.current instanceof Window) {
			const observeElementWidth = (e.currentTarget as Window).innerWidth;
			const observeElementHeight = (e.currentTarget as Window).innerHeight;
			setElementSize({
				height: observeElementHeight,
				width: observeElementWidth,
			});
			return;
		}

		const observeElementSize = observeElement.current?.getBoundingClientRect();
		setElementSize({
			height: observeElementSize?.height || 0,
			width: observeElementSize?.width || 0,
		});
	};

	const initialResizeHandler = () => {
		if (!observeElement.current) return;

		if (observeElement.current instanceof Window) {
			const observeElementWidth = observeElement.current.innerWidth;
			const observeElementHeight = observeElement.current.innerHeight;
			setElementSize({
				height: observeElementHeight,
				width: observeElementWidth,
			});
			return;
		}

		const observeElementSize = observeElement.current?.getBoundingClientRect();
		setElementSize({
			width: observeElementSize?.width || 0,
			height: observeElementSize?.height || 0,
		});
	};

	useEffect(() => {
		const currentElement = observeElement.current;
		initialResizeHandler();

		if (currentElement instanceof HTMLElement) {
			window.addEventListener("resize", resizeHandler);
		}

		return () => {
			if (currentElement instanceof HTMLElement) {
				window.removeEventListener("resize", resizeHandler);
			}
		};
	}, [observeElement]);

	return {
		size: elementSize,
		observeElement: observeElement.current,
		setObserveElement,
	};
};

export default useElementSize;
