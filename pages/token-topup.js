import { withPageAuthRequired } from "@auth0/nextjs-auth0";

function TokenTopup() {
	return <div>TokenTopup</div>;
}

export default TokenTopup;

export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {},
	};
});