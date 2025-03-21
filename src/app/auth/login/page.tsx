import BannerGradient from "@/components/layouts/users/BannerGradient";
import BannerContent from "@/components/layouts/users/BannerContent";
import Layout from "@/components/layouts/users/Layout";
import Container from "@/components/layouts/Container";
import LoginForm from "./components/Form";

export default async function Page() {
	return (
		<Layout>
			<Container className="flex h-full flex-row gap-10 lg:gap-16">
				<div className="hidden md:flex">
					<BannerGradient classNames="w-[25vw] max-w-[25rem] h-full" />
				</div>
				<div className="w-full">
					<BannerContent
						title={`Resource Hub: \n Sign In for Software Goodness`}
						description={`Dive into a wealth of coding libraries, frameworks, and tools curated just for you. \n Remember, your next breakthrough awaits! 🚀
                        `}
					/>
					<LoginForm />
				</div>
			</Container>
		</Layout>
	);
}
