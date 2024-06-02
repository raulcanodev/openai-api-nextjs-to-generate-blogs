import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link'

function Success() {


	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="bg-white p-8 rounded-lg shadow-lg text-center">
				<FontAwesomeIcon icon={faCircleCheck} className="text-4xl" />
				<h1 className="text-2xl font-semibold mb-2 text-gray-800">
					Thank You for Your Purchase!
				</h1>
				<p className="text-gray-600 mb-4">
					Your order has been successfully processed.
				</p>
				<Link className="btn" href={`/post/new`}>
					Go to Homepage
				</Link>
			</div>
		</div>
	);
}

export default Success;

Success.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(ctx) {
		const props = await getAppProps(ctx);
		return { props };
	},
});
