import React, { useEffect, useRef, useState } from "react";

type IObserveElement = Window | HTMLElement | null;
type ISize = { height: number; width: number };

type IUseElementSizeResult = {
	size: ISize;
	observeElement: IObserveElement;
	setObserveElement: (el: HTMLElement) => void;
};

/**
 * Description placeholder
 * @date 2/27/2024 - 9:57:33 AM
 *
 * @param {IObserveElement} target - Description target to be observed
 * @returns {IUseElementSizeResult} Description returns the element size and the observe element
 *
 */
const useElementSize = (target?: IObserveElement): IUseElementSizeResult => {
	const [elementSize, setElementSize] = useState<ISize>({
		height: 0,
		width: 0,
	});
	const observeElement = useRef<IObserveElement>(target || null);

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
