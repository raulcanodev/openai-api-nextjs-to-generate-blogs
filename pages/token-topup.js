import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";

function TokenTopup() {
	return <div>TokenTopup</div>;
}

export default TokenTopup;

TokenTopup.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>;
};


export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {},
	};
});