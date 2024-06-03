import {
	withPageAuthRequired,
	getSession,
} from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import { AppLayout } from '../../components/AppLayout';
import { ObjectId } from 'mongodb';
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { getAppProps } from "../../utils/getAppProps";
import {useState, useContext} from 'react'
import {useRouter} from 'next/router'
import PostsContext from "../../context/postsContext";


export default function Post(props) {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const {deletePost} = useContext(PostsContext);
	const router = useRouter()

	const handleDeleteConfirm = async () => {
		try {
			const response = await fetch(`/api/deletePosts`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({ postId: props.id }),
			});
			const json = await response.json();
			if(json.success){
				deletePost(props.id)
				router.replace(`/post/new`)
			}
		} catch (error) {
			
		}
	}

  return (
		<div className="overflow-auto h-full">
			<div className="max-w-screen-sm mx-auto">
				<div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-lg">
					SEO title and meta description
				</div>
				<div className="p-4 my-2 border border-stone-200 rounded-lg">
					<div className="text-blue-600 text-2xl font-bold">
						{props.title}
					</div>
					<Markdown className="mt-2" rehypePlugins={[rehypeRaw]}>
						{props.metaDescription}
					</Markdown>
				</div>
				<div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-lg">
					Keywords
				</div>
				<div className="flex flex-wrap pt-2 gap-1">
					{props.keywords.split(",").map((keyword, i) => (
						<div
							key={i}
							className="p-2 rounded-lg bg-slate-800 text-white">
							#{keyword}
						</div>
					))}
				</div>
				<div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-lg">
					Blog post
				</div>
				<Markdown rehypePlugins={[rehypeRaw]}>
					{props.postContent || ""}
				</Markdown>
				{!showDeleteConfirm && (
					<div className="my-8">
						<button
							onClick={() => setShowDeleteConfirm(true)}
							className="btn bg-red-600 hover:bg-red-700">
							Delete post
						</button>
					</div>
				)}
				{showDeleteConfirm && (
					<div className="my-4">
						<p className="p-2 bg-red-300 text-center rounded-lg">
							Are you sure you want to delete this posts? This
							action is irreversible
						</p>
						<div className="grid grid-cols-2 gap-4">
							<button onClick={()=> setShowDeleteConfirm(false)} className="btn bg-stone-600 hover:bg-stone-700">
								Cancel
							</button>
							<button onClick={handleDeleteConfirm} className="btn bg-red-600 hover:bg-red-700">
								Confirm delete
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
  );
}



Post.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx){
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("BlogAI");
    const user = await db.collection("users").findOne({auth0id: userSession.user.sub});
    const post = await db.collection("posts").findOne({_id: new ObjectId(ctx.params.postId),
      userId: user._id
    });
    
    if(!post){
      return{
      redirect:{
        destination: '/post/new',
        permanent: false
      }
    }
  }
  return {
    props: {
			id: ctx.params.postId,
      postContent: post.postContent,
      title: post.title,
      metaDescription: post.metaDescription,
      keywords: post.keywords,
			postCreated: post.created.toString(),
      ...props
    }
  }
}
});