import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout/';
import Markdown from 'react-markdown';
import {useState} from 'react';


export default function NewPost() {
  const [postContent, setPostContent] = useState('');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const response = await fetch('/api/generatePost',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic,
        keywords
      })
    });
    const json = await response.json();
    setPostContent(json.post.postContent);
  }

  return (
		<div>
			<form onSubmit={handleSubmit}>
				<div>
					<label>
						<strong>Generate a blog post on the topic of:</strong>
					</label>
					<textarea
						className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-lg"
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
					/>
				</div>
				<div>
					<label>
						<strong>
							Targeting the following comma-separated keywords:
						</strong>
					</label>
					<textarea
						className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-lg"
						value={keywords}
						onChange={(e) => setKeywords(e.target.value)}
					/>
				</div>
				<button type="submit" className="btn">
					Generate
				</button>
			</form>
			<Markdown>{postContent}</Markdown>
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