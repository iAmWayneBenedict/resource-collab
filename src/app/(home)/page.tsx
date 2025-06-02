import Banner from "./_components/Banner";
import Contact from "./_components/Contact";
import Layout from "@/components/layouts/users/Layout";
import Container from "@/components/layouts/Container";
import Features from "@/components/ui/features-2";
import ContentSection from "@/components/ui/content-3";
import Integrations from "@/components/ui/integrations-three";
import TestimonialSection from "@/components/ui/testimonials-two";
import FAQsThree from "@/components/ui/faqs-3";

export default async function Home() {
	return (
		<Layout>
			<div className="flex justify-center">
				<Container>
					<Banner />
					<Features />
					<ContentSection />
					<Integrations />
					<TestimonialSection />
					<FAQsThree />

					<Contact />
				</Container>
			</div>
		</Layout>
	);
}
