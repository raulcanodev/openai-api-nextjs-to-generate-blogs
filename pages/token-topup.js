import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

function TokenTopup() {
	const handleClick = async () => {
		const result = await fetch('/api/addToken',{
			method: 'POST',
		});	
		const json = await result.json();
		// console.log("Result ", json)
		window.location.href = json.session.url;
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm mx-auto">
				<h1 className="text-3xl font-semibold mb-4 text-gray-800">
					Top Up Your Tokens
				</h1>
				<p className="text-gray-600 mb-6">
					Click the button below to add more tokens to your account.
				</p>
				<button
					className="btn"
					onClick={handleClick}>
					Add Tokens
				</button>
			</div>
		</div>
	);
}

export default TokenTopup;

TokenTopup.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>;
};


export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(ctx){
		const props = await getAppProps(ctx);
		return {props};
	}
});