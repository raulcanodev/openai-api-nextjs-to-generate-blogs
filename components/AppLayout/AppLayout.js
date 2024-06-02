import React, { useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo/Logo";
import PostsContext from "../../context/postsContext";

export const AppLayout = ({
	children,
	availableTokens,
	posts: postsFromSSR,
	postId,
}) => {
	const { user } = useUser();

	const { setPostsFromSSR, posts, getPosts } = useContext(PostsContext);

	useEffect(() => {
		setPostsFromSSR(postsFromSSR);
	}, [postsFromSSR, setPostsFromSSR]);

	return (
		<>
			<div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
				<div className="flex flex-col text-white overflow-hidden">
					<div className="bg-slate-800 px-2">
						<Link href="/" className="block mt-2 text-center">
							<Logo />
						</Link>
						<Link href="/post/new" className="btn">
							New post
						</Link>
						<Link
							href="/token-topup"
							className="block mt-2 text-center ">
							<FontAwesomeIcon
								icon={faCoins}
								className="text-yellow-500"
							/>
							<span className="pl-1">
								{availableTokens} Tokens available
							</span>
						</Link>
					</div>
					<div className="flex-1 px-3 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
						{posts.map((post) => (
							<Link
								className={`block border border-white/0 text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-lg py-1 ${
									postId === post._id
										? "bg-white/20 border-white"
										: ""
								}`}
								key={post._id}
								href={`/post/${post._id}`}>
								{post.topic}
							</Link>
						))}
						<div
							onClick={() => {
								getPosts({
									lastPostDate:
										posts[posts.length - 1].created,
								});
							}}
							className="hover:underline text-sm text-slate-400 text-center cursor-pointer mt-4">
							Load more posts
						</div>
					</div>
					<div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
						{user ? (
							<>
								<div className="min-w-[50px]">
									<Image
										src={user.picture}
										alt={user.name}
										width={50}
										height={50}
										className="rounded-full"
									/>
								</div>
								<div className="flex-1">
									<div className="font-bold">{user.name}</div>
									<Link
										className="text-sm"
										href="/api/auth/logout">
										Logout
									</Link>
								</div>
							</>
						) : (
							<Link href="/api/auth/login">Login</Link>
						)}
					</div>
				</div>
				{children}
			</div>
		</>
	);
};
