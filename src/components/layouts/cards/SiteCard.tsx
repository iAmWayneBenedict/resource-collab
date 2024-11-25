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
        <div className="flex flex-row gap-4 items-center p-2 shadow-xl rounded-xl">
            <div className="~min-w-32/48 ~w-32/48 max-h-28 overflow-hidden rounded-lg">
                <Image
                    className="w-full h-auto object-contain object-center"
                    removeWrapper
                    alt="NextUI hero Image with delay"
                    src={img}/>
            </div>
            <div className="flex flex-col gap-1 max-h-full overflow-hidden">
                <h1 className="text-xl font-bold ~max-w-sm/lg overflow-hidden whitespace-nowrap text-ellipsis">{title}</h1>
                <p className="text-sm ~max-w-sm/lg overflow-hidden whitespace-nowrap text-ellipsis">{description}</p>
                <p className="text-xs text-violet italic">{link}</p>
            </div>
        </div>
    )
}