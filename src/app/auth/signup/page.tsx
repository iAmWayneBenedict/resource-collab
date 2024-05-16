import BannerGradient from "@/components/layouts/users/BannerGradient";
import BannerContent from "@/components/layouts/users/BannerContent";
import Layout from "@/components/layouts/users/Layout";
import Container from "@/components/layouts/Container";
import SignUpForm from "./components/Form";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Signup() {
	const { user } = await validateRequest();
	if (user) redirect("/");
	return (
		<Layout>
			<Container className="mt-32 lg:mt-48 2xl:mt-52 flex flex-row h-full gap-10 lg:gap-16">
				<div className="hidden md:flex">
					<BannerGradient classNames="w-[25vw] max-w-[25rem] h-full" />
				</div>
				<div className="w-full">
					<BannerContent
						title={`Ready to Shine? \n Sign Up for Software Resources and Showcase Your Portfolio!`}
						description={`Become part of our innovation hub! By signing up, you’ll gain exclusive access to software libraries, portfolio inspirations, and networking opportunities. Let’s create something amazing together!`}
						descriptionClasses="max-w-[50rem]"
					/>
					<SignUpForm />
				</div>
			</Container>
		</Layout>
	);
}
