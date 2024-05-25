import Image from "next/image";
import HeroImage from "../public/hero.webp";
import {Logo} from "../components/Logo";
import Link from "next/link";

export default function Home() {

  return (
		<>
			<div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
				{/* <Image src={HeroImage} fill className:"absolute" alt="Hero image" /> */}
				<div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
				<div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-zinc-900	 rounded-3xl blackdrop-blur-sm">
					<Logo />
					<p>
						The AI-powered SASS solution to generate SEO-optimiced
						blog posts in minutes. Get high-quality content, without
						sacrificing your time.
					</p>
					<Link className="btn mt-7" href="/post/new">
						Begin
					</Link>
				</div>
			</div>
		</>
  );
}
