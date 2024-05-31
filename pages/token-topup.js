import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

function TokenTopup() {
	const handleClick = async () => {
		await fetch('/api/addToken',{
			method: 'POST',
		});	
	}

	return <div>
		<h1>Topup your tokens</h1>
		<button className="btn" onClick={handleClick}>Add tokens</button>
	</div>;
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