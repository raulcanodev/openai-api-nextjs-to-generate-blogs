import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { OpenAIApi, Configuration } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
	const { user } = await getSession(req, res);
	const client = await clientPromise;
	const db = client.db("BlogAI");
	// console.log(user.sub)

	const userProfile = await db
		.collection("users")
		.findOne({ auth0id: user.sub });
	// console.log(userProfile)

	if (!userProfile?.availableTokens) {
		res.status(403).json({ error: "Not enough tokens" });
		return;
	}

	const config = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});

	const openai = new OpenAIApi(config);

	const { topic, keywords } = req.body;

	if (!topic || !keywords) {
		res.status(422);
		return;
	}

	if (topic.length > 80 || keywords.length > 80) {
		res.status(422);
		return;
	}

	try {
		const response = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are a blog post generator.",
				},
				{
					role: "user",
					content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      		The response should be formatted in SEO-friendly HTML, 
      		limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol. 
					Do not use <!DOCTYPE html> <title></title> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title></title> <head></head> <body></body>`,
				},
			],
			temperature: 0,
		});

		const postContent = response.data.choices[0]?.message?.content;

		const titleResult = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are a blog post generator.",
				},
				{
					role: "user",
					content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      		The response should be formatted in SEO-friendly HTML without the title tag, 
      		limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.>.
					Do not use <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title></title> <head></head> <body></body>`,
				},
				{
					role: "assistant",
					content: postContent,
				},
				{
					role: "user",
					content:
						"Generate appropriate title tag text for the above blog post",
				},
			],
			temperature: 0,
		});

		const metaDescriptionResult = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are a blog post generator.",
				},
				{
					role: "user",
					content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      		The response should be formatted in SEO-friendly HTML, 
      		limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.  DONT USE <meta name="description" content="...".
					Do not use <!DOCTYPE html><html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title></title> <head></head> <body></body> <meta name="description" content="`,
				},
				{
					role: "assistant",
					content: postContent,
				},
				{
					role: "user",
					content:
						"Generate SEO-friendly meta description content for the above blog post",
				},
			],
			temperature: 0,
		});

		const title = titleResult.data.choices[0]?.message.content;

		const metaDescription =
			metaDescriptionResult.data.choices[0]?.message.content;

		await db.collection("users").updateOne(
			{
				auth0id: user.sub,
			},
			{
				$inc: {
					availableTokens: -1,
				},
			}
		);

		const post = await db.collection("posts").insertOne({
			postContent: postContent || "",
			title: title || "",
			metaDescription: metaDescription || "",
			topic,
			keywords,
			userId: userProfile._id,
			created: new Date(),
		});

		res.status(200).json({
			postId: post.insertedId,
		});
	} catch (error) {
		console.error("Error generating blog post:", error);
		res.status(500).json({ error: "Failed to generate blog post" });
	}
});
