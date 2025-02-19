import Banner from "./_components/Banner";
import Card from "./_components/Card";
import Contact from "./_components/Contact";
import Layout from "@/components/layouts/users/Layout";
import Container from "@/components/layouts/Container";

export default async function Home() {
	return (
		<Layout>
			<Container>
				<Banner />

				<div className="mt-16 grid grid-cols-1 grid-rows-1 gap-4 lg:grid-cols-2 lg:grid-rows-2">
					{[1, 2, 3, 4].map((el) => (
						<Card key={el} />
					))}
				</div>
				<Contact />
			</Container>
		</Layout>
	);
}
