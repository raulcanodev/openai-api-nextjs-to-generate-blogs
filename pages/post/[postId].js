import { withPageAuthRequired } from '@auth0/nextjs-auth0';

function Post() {
  return (
    <div>
      Post page
    </div>
  )
}

export default Post

export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {},
	};
});