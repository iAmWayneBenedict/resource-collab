import React from "react";
import { Image } from "@nextui-org/image"

type Props = {
    img: string,
    title: string,
    description: string
    link: string
};
export const SiteCard:React.FC<Props> = ({img, title, description, link}) => {
    return (
        <div className="flex flex-row gap-4 items-center p-3 shadow-md rounded-2xl bg-white dark:bg-black">
            <div className="~min-w-32/40 ~w-32/40 max-h-28 overflow-hidden rounded-xl">
                <Image
                    className="w-full h-auto object-contain object-center rounded-none"
                    removeWrapper
                    alt="NextUI hero Image with delay"
                    src={img}/>
            </div>
            <div className="flex flex-col gap-1 max-h-full overflow-hidden">
                <h1 className="text-lg font-bold ~max-w-sm/lg overflow-hidden whitespace-nowrap text-ellipsis">{title}</h1>
                <p className="text-sm ~max-w-sm/lg overflow-hidden whitespace-nowrap text-ellipsis">{description}</p>
                <p className="text-xs text-violet italic">{link}</p>
            </div>
        </div>
    )
}