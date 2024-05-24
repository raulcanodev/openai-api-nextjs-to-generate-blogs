import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import App from 'next/app';
import { AppLayout } from '../../components/AppLayout/';

export default function NewPost({test}) {
	return (
		<div>
			<h1>New post page</h1>
		</div>
	);
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout{...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired (() => {
  return {
    props: {
    },
  };
})