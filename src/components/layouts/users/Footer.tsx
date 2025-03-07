"use client";

import Link from "next/link";
import React from "react";
import { useTime } from "@/hooks";

const Footer = () => {
	const year = useTime({ options: { year: "numeric" } });
	return (
		<div className="absolute bottom-[30px] left-1/2 z-50 flex w-[95%] -translate-x-1/2 items-center justify-between rounded-full bg-blur-background px-10 py-5 shadow-lg backdrop-blur-md md:w-[90%]">
			<div id="nav-left" className="hidden flex-1 md:flex">
				<div className="flex items-center">
					<Link href="/" className="flex items-center">
						<span className="text-xl font-bold">Co.</span>
					</Link>
				</div>
			</div>
			<div className="flex w-fit justify-center md:flex-1">
				{year && (
					<small className="flex gap-2">
						<span className="hidden md:flex">
							All Rights Reserved
						</span>
						<span className="hidden md:flex">|</span>
						<span>© {year}</span>
					</small>
				)}
			</div>
			<div className="flex flex-1 items-center justify-end gap-3">
				<Link
					href="https://iamwayne.vercel.app/"
					target="_blank"
					passHref
				>
					<svg
						width="106"
						height="20"
						viewBox="0 0 106 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="text-black dark:text-white"
					>
						<path
							d="M1.37285 8.89062H2.4666L4.52227 14.374L6.57305 8.89062H7.6668L4.95195 16H4.08281L1.37285 8.89062ZM0.874805 8.89062H1.91484L2.09551 13.6367V16H0.874805V8.89062ZM7.12481 8.89062H8.16973V16H6.94414V13.6367L7.12481 8.89062ZM12.5861 14.9404V12.4209C12.5861 12.2321 12.552 12.0693 12.4836 11.9326C12.4152 11.7959 12.3111 11.6901 12.1711 11.6152C12.0344 11.5404 11.8619 11.5029 11.6535 11.5029C11.4615 11.5029 11.2954 11.5355 11.1555 11.6006C11.0155 11.6657 10.9064 11.7536 10.8283 11.8643C10.7502 11.9749 10.7111 12.1003 10.7111 12.2402H9.53926C9.53926 12.0319 9.58971 11.8301 9.69063 11.6348C9.79154 11.4395 9.93802 11.2653 10.1301 11.1123C10.3221 10.9593 10.5516 10.8389 10.8186 10.751C11.0855 10.6631 11.385 10.6191 11.717 10.6191C12.1141 10.6191 12.4657 10.6859 12.7717 10.8193C13.0809 10.9528 13.3234 11.1546 13.4992 11.4248C13.6783 11.6917 13.7678 12.027 13.7678 12.4307V14.7793C13.7678 15.0202 13.7841 15.2367 13.8166 15.4287C13.8524 15.6175 13.9029 15.7819 13.968 15.9219V16H12.7619C12.7066 15.873 12.6626 15.7119 12.6301 15.5166C12.6008 15.318 12.5861 15.126 12.5861 14.9404ZM12.757 12.7871L12.7668 13.5146H11.9221C11.704 13.5146 11.5119 13.5358 11.3459 13.5781C11.1799 13.6172 11.0415 13.6758 10.9309 13.7539C10.8202 13.832 10.7372 13.9264 10.6818 14.0371C10.6265 14.1478 10.5988 14.2731 10.5988 14.4131C10.5988 14.5531 10.6314 14.6816 10.6965 14.7988C10.7616 14.9128 10.856 15.0023 10.9797 15.0674C11.1066 15.1325 11.2596 15.165 11.4387 15.165C11.6796 15.165 11.8895 15.1162 12.0686 15.0186C12.2508 14.9176 12.3941 14.7956 12.4982 14.6523C12.6024 14.5059 12.6577 14.3675 12.6643 14.2373L13.0451 14.7598C13.0061 14.8932 12.9393 15.0365 12.8449 15.1895C12.7505 15.3424 12.6268 15.4889 12.4738 15.6289C12.3241 15.7656 12.1434 15.8779 11.9318 15.9658C11.7235 16.0537 11.4826 16.0977 11.2092 16.0977C10.8641 16.0977 10.5565 16.0293 10.2863 15.8926C10.0161 15.7526 9.80456 15.5654 9.65156 15.3311C9.49857 15.0934 9.42207 14.8249 9.42207 14.5254C9.42207 14.2454 9.47415 13.998 9.57832 13.7832C9.68574 13.5651 9.84199 13.3828 10.0471 13.2363C10.2554 13.0898 10.5093 12.9792 10.8088 12.9043C11.1083 12.8262 11.4501 12.7871 11.8342 12.7871H12.757ZM18.3209 14.9062V8.5H19.5025V16H18.4332L18.3209 14.9062ZM14.8834 13.417V13.3145C14.8834 12.9141 14.9306 12.5495 15.025 12.2207C15.1194 11.8887 15.2561 11.6038 15.4352 11.3662C15.6142 11.1253 15.8323 10.9414 16.0895 10.8145C16.3466 10.6842 16.6363 10.6191 16.9586 10.6191C17.2776 10.6191 17.5576 10.681 17.7984 10.8047C18.0393 10.9284 18.2444 11.1058 18.4137 11.3369C18.5829 11.5648 18.718 11.8382 18.8189 12.1572C18.9199 12.473 18.9915 12.8245 19.0338 13.2119V13.5391C18.9915 13.9167 18.9199 14.2617 18.8189 14.5742C18.718 14.8867 18.5829 15.1569 18.4137 15.3848C18.2444 15.6126 18.0377 15.7884 17.7936 15.9121C17.5527 16.0358 17.2711 16.0977 16.9488 16.0977C16.6298 16.0977 16.3417 16.0309 16.0846 15.8975C15.8307 15.764 15.6142 15.5768 15.4352 15.3359C15.2561 15.0951 15.1194 14.8118 15.025 14.4863C14.9306 14.1576 14.8834 13.8011 14.8834 13.417ZM16.0602 13.3145V13.417C16.0602 13.6579 16.0813 13.8825 16.1236 14.0908C16.1692 14.2992 16.2392 14.4831 16.3336 14.6426C16.428 14.7988 16.5501 14.9225 16.6998 15.0137C16.8528 15.1016 17.0351 15.1455 17.2467 15.1455C17.5136 15.1455 17.7333 15.0869 17.9059 14.9697C18.0784 14.8525 18.2135 14.6947 18.3111 14.4961C18.412 14.2943 18.4804 14.0697 18.5162 13.8223V12.9385C18.4967 12.7464 18.456 12.5674 18.3941 12.4014C18.3355 12.2354 18.2558 12.0905 18.1549 11.9668C18.054 11.8398 17.9286 11.7422 17.7789 11.6738C17.6324 11.6022 17.4583 11.5664 17.2564 11.5664C17.0416 11.5664 16.8593 11.612 16.7096 11.7031C16.5598 11.7943 16.4361 11.9196 16.3385 12.0791C16.2441 12.2386 16.1741 12.4242 16.1285 12.6357C16.0829 12.8473 16.0602 13.0736 16.0602 13.3145ZM23.1621 16.0977C22.7715 16.0977 22.4183 16.0342 22.1025 15.9072C21.79 15.777 21.5231 15.5964 21.3018 15.3652C21.0837 15.1341 20.916 14.8623 20.7988 14.5498C20.6816 14.2373 20.623 13.9004 20.623 13.5391V13.3438C20.623 12.9303 20.6833 12.556 20.8037 12.2207C20.9242 11.8854 21.0918 11.599 21.3066 11.3613C21.5215 11.1204 21.7754 10.9365 22.0684 10.8096C22.3613 10.6826 22.6787 10.6191 23.0205 10.6191C23.3981 10.6191 23.7285 10.6826 24.0117 10.8096C24.2949 10.9365 24.5293 11.1156 24.7148 11.3467C24.9036 11.5745 25.0436 11.8464 25.1348 12.1621C25.2292 12.4779 25.2764 12.8262 25.2764 13.207V13.71H21.1943V12.8652H24.1143V12.7725C24.1077 12.5609 24.0654 12.3623 23.9873 12.1768C23.9124 11.9912 23.7969 11.8415 23.6406 11.7275C23.4844 11.6136 23.276 11.5566 23.0156 11.5566C22.8203 11.5566 22.6462 11.599 22.4932 11.6836C22.3434 11.765 22.2181 11.8838 22.1172 12.04C22.0163 12.1963 21.9382 12.3851 21.8828 12.6064C21.8307 12.8245 21.8047 13.0703 21.8047 13.3438V13.5391C21.8047 13.7702 21.8356 13.985 21.8975 14.1836C21.9626 14.3789 22.057 14.5498 22.1807 14.6963C22.3044 14.8428 22.4541 14.9583 22.6299 15.043C22.8057 15.1243 23.0059 15.165 23.2305 15.165C23.5137 15.165 23.766 15.1081 23.9873 14.9941C24.2087 14.8802 24.4007 14.7191 24.5635 14.5107L25.1836 15.1113C25.0697 15.2773 24.9215 15.4368 24.7393 15.5898C24.557 15.7396 24.334 15.8617 24.0703 15.9561C23.8099 16.0505 23.5072 16.0977 23.1621 16.0977ZM28.8895 8.5H30.0662V14.8721L29.9539 16H28.8895V8.5ZM33.5135 13.3096V13.4121C33.5135 13.8027 33.4695 14.1624 33.3816 14.4912C33.297 14.8167 33.1668 15.0999 32.991 15.3408C32.8185 15.5817 32.6036 15.7689 32.3465 15.9023C32.0926 16.0326 31.798 16.0977 31.4627 16.0977C31.1339 16.0977 30.8475 16.0358 30.6033 15.9121C30.3592 15.7884 30.1541 15.6126 29.9881 15.3848C29.8253 15.1569 29.6935 14.8851 29.5926 14.5693C29.4917 14.2536 29.4201 13.9053 29.3777 13.5244V13.1973C29.4201 12.8132 29.4917 12.4648 29.5926 12.1523C29.6935 11.8366 29.8253 11.5648 29.9881 11.3369C30.1541 11.1058 30.3576 10.9284 30.5984 10.8047C30.8426 10.681 31.1274 10.6191 31.4529 10.6191C31.7915 10.6191 32.0893 10.6842 32.3465 10.8145C32.6069 10.9447 32.8234 11.1302 32.9959 11.3711C33.1684 11.6087 33.297 11.8919 33.3816 12.2207C33.4695 12.5495 33.5135 12.9124 33.5135 13.3096ZM32.3367 13.4121V13.3096C32.3367 13.0719 32.3172 12.849 32.2781 12.6406C32.2391 12.429 32.174 12.2435 32.0828 12.084C31.9949 11.9245 31.8745 11.7992 31.7215 11.708C31.5717 11.6136 31.3846 11.5664 31.16 11.5664C30.9516 11.5664 30.7726 11.6022 30.6229 11.6738C30.4731 11.7454 30.3478 11.8431 30.2469 11.9668C30.146 12.0905 30.0662 12.2337 30.0076 12.3965C29.9523 12.5592 29.9148 12.735 29.8953 12.9238V13.8076C29.9246 14.0518 29.9865 14.2764 30.0809 14.4814C30.1785 14.6833 30.3152 14.846 30.491 14.9697C30.6668 15.0902 30.893 15.1504 31.1697 15.1504C31.3878 15.1504 31.5717 15.1064 31.7215 15.0186C31.8712 14.9307 31.99 14.8086 32.0779 14.6523C32.1691 14.4928 32.2342 14.3073 32.2732 14.0957C32.3156 13.8841 32.3367 13.6562 32.3367 13.4121ZM36.0842 15.4238L37.5197 10.7168H38.7795L36.6604 16.8057C36.6115 16.9359 36.548 17.0775 36.4699 17.2305C36.3918 17.3835 36.2893 17.5283 36.1623 17.665C36.0386 17.805 35.884 17.9173 35.6984 18.002C35.5129 18.0898 35.2883 18.1338 35.0246 18.1338C34.9204 18.1338 34.8195 18.124 34.7219 18.1045C34.6275 18.0882 34.538 18.0703 34.4533 18.0508L34.4484 17.1523C34.481 17.1556 34.5201 17.1589 34.5656 17.1621C34.6145 17.1654 34.6535 17.167 34.6828 17.167C34.8781 17.167 35.0409 17.1426 35.1711 17.0938C35.3013 17.0482 35.4071 16.9733 35.4885 16.8691C35.5731 16.765 35.6447 16.625 35.7033 16.4492L36.0842 15.4238ZM35.2736 10.7168L36.5285 14.6719L36.7385 15.9121L35.923 16.1221L34.0041 10.7168H35.2736Z"
							fill="currentColor"
						/>
						<path
							d="M64.2326 4.752C64.478 4.752 64.7126 4.848 64.9366 5.04C65.1606 5.22133 65.2726 5.472 65.2726 5.792C65.2726 5.888 65.2566 5.99467 65.2246 6.112L62.0726 15.392C62.0086 15.584 61.8913 15.7333 61.7206 15.84C61.5606 15.936 61.39 15.9893 61.2086 16C61.0273 16 60.846 15.9467 60.6646 15.84C60.494 15.7333 60.3606 15.5787 60.2646 15.376L57.8966 10L58.0406 10.096L55.7046 15.376C55.6086 15.5787 55.47 15.7333 55.2886 15.84C55.118 15.9467 54.942 16 54.7606 16C54.59 15.9893 54.4193 15.936 54.2486 15.84C54.078 15.7333 53.9606 15.584 53.8966 15.392L50.7446 6.112C50.7126 5.99467 50.6966 5.888 50.6966 5.792C50.6966 5.472 50.8086 5.22133 51.0326 5.04C51.2673 4.848 51.5073 4.752 51.7526 4.752C51.9553 4.752 52.142 4.80533 52.3126 4.912C52.494 5.01867 52.6166 5.17333 52.6806 5.376L55.2246 13.088L54.8726 13.072L57.1446 7.616C57.23 7.424 57.3526 7.27467 57.5126 7.168C57.6726 7.05067 57.854 6.99733 58.0566 7.008C58.2593 6.99733 58.4406 7.05067 58.6006 7.168C58.7606 7.27467 58.878 7.424 58.9526 7.616L61.0326 12.832L60.7766 12.992L63.2886 5.376C63.3526 5.17333 63.4753 5.01867 63.6566 4.912C63.838 4.80533 64.03 4.752 64.2326 4.752ZM70.587 7.312L67.131 15.44C67.0563 15.6427 66.939 15.8027 66.779 15.92C66.6297 16.0267 66.4643 16.08 66.283 16.08C65.995 16.08 65.7817 16 65.643 15.84C65.5043 15.68 65.435 15.4827 65.435 15.248C65.435 15.152 65.451 15.0507 65.483 14.944L69.467 5.376C69.5523 5.16267 69.6803 4.99733 69.851 4.88C70.0323 4.76267 70.2243 4.71467 70.427 4.736C70.619 4.736 70.795 4.79467 70.955 4.912C71.1257 5.01867 71.2483 5.17333 71.323 5.376L75.259 14.752C75.3123 14.8907 75.339 15.0187 75.339 15.136C75.339 15.424 75.243 15.6533 75.051 15.824C74.8697 15.9947 74.667 16.08 74.443 16.08C74.251 16.08 74.075 16.0213 73.915 15.904C73.7657 15.7867 73.6483 15.6267 73.563 15.424L70.123 7.408L70.587 7.312ZM67.627 13.488L68.507 11.648H72.827L73.131 13.488H67.627ZM83.2423 4.752C83.4876 4.752 83.7063 4.848 83.8983 5.04C84.1009 5.22133 84.2023 5.456 84.2023 5.744C84.2023 5.84 84.1863 5.94133 84.1543 6.048C84.1329 6.144 84.0903 6.24 84.0263 6.336L80.3943 11.536L80.6823 10.432V15.024C80.6823 15.3013 80.5863 15.536 80.3943 15.728C80.2129 15.9093 79.9996 16 79.7543 16C79.4876 16 79.2583 15.9093 79.0663 15.728C78.8849 15.536 78.7943 15.3013 78.7943 15.024V10.56L78.9223 11.072L75.4663 6.48C75.3596 6.34133 75.2849 6.208 75.2423 6.08C75.1996 5.952 75.1783 5.83467 75.1783 5.728C75.1783 5.44 75.2903 5.20533 75.5143 5.024C75.7383 4.84267 75.9676 4.752 76.2023 4.752C76.5009 4.752 76.7623 4.90133 76.9863 5.2L80.0583 9.44L79.6102 9.376L82.4423 5.232C82.6663 4.912 82.9329 4.752 83.2423 4.752ZM94.2335 4.8C94.4895 4.8 94.6975 4.88533 94.8575 5.056C95.0175 5.22667 95.0975 5.44 95.0975 5.696V15.024C95.0975 15.3013 95.0015 15.536 94.8095 15.728C94.6282 15.9093 94.3988 16 94.1215 16C93.9828 16 93.8388 15.9787 93.6895 15.936C93.5508 15.8827 93.4442 15.8133 93.3695 15.728L87.0815 7.744L87.4975 7.488V15.104C87.4975 15.36 87.4122 15.5733 87.2415 15.744C87.0815 15.9147 86.8682 16 86.6015 16C86.3455 16 86.1375 15.9147 85.9775 15.744C85.8175 15.5733 85.7375 15.36 85.7375 15.104V5.776C85.7375 5.49867 85.8282 5.26933 86.0095 5.088C86.2015 4.896 86.4362 4.8 86.7135 4.8C86.8628 4.8 87.0175 4.832 87.1775 4.896C87.3375 4.94933 87.4548 5.03467 87.5295 5.152L93.6255 12.928L93.3535 13.12V5.696C93.3535 5.44 93.4335 5.22667 93.5935 5.056C93.7535 4.88533 93.9668 4.8 94.2335 4.8ZM98.5791 4.8H103.939C104.216 4.8 104.446 4.89067 104.627 5.072C104.819 5.24267 104.915 5.46667 104.915 5.744C104.915 6.01067 104.819 6.22933 104.627 6.4C104.446 6.56 104.216 6.64 103.939 6.64H99.4591L99.6031 6.368V9.488L99.4751 9.36H103.219C103.496 9.36 103.726 9.45067 103.907 9.632C104.099 9.80267 104.195 10.0267 104.195 10.304C104.195 10.5707 104.099 10.7893 103.907 10.96C103.726 11.12 103.496 11.2 103.219 11.2H99.5231L99.6031 11.072V14.304L99.4751 14.16H103.939C104.216 14.16 104.446 14.256 104.627 14.448C104.819 14.6293 104.915 14.8427 104.915 15.088C104.915 15.3547 104.819 15.5733 104.627 15.744C104.446 15.9147 104.216 16 103.939 16H98.5791C98.3018 16 98.0671 15.9093 97.8751 15.728C97.6938 15.536 97.6031 15.3013 97.6031 15.024V5.776C97.6031 5.49867 97.6938 5.26933 97.8751 5.088C98.0671 4.896 98.3018 4.8 98.5791 4.8Z"
							fill="currentColor"
						/>
					</svg>
				</Link>
			</div>
		</div>
	);
};

export default Footer;
