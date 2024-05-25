import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import App from 'next/app';
import { AppLayout } from '../../components/AppLayout/';
import Markdown from 'react-markdown';
import {useState} from 'react';


export default function NewPost({test}) {
  const [postContent, setPostContent] = useState('');


  const handleSubmit = async ()=>{
    const response = await fetch('/api/generatePost',{
      method: 'POST',
    });
    const json = await response.json();
    setPostContent(json.content);
  }


  return (
		<div>
			<h1>New post page</h1>
      <button className='btn' onClick={handleSubmit}>generate</button>
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