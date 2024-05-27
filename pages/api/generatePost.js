import { OpenAIApi, Configuration } from "openai";

export default async function handler(req, res) {
	const config = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});

	const openai = new OpenAIApi(config);

	const { topic, keywords } = req.body;

	try {
		const response = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"You are an SEO friendly blog post generator called BlogAI. You are designed to output markdown without formatting. Ensure it is a .md",
				},
				{
					role: "user",
					content: `Generate me a blog post on the following topic delimited by triple hyphens: 
          ---
          ${topic}
          ---
          Targeting the following comma-separated keywords delimited by triple hyphens: 
          ---
          ${keywords}
          ---`,
				},
			],
		});

		const postContent = response.data.choices[0]?.message?.content;

		const seoResponse = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"You are an SEO friendly blog post generator called BlogAI. You are designed to output JSON. Do not include html tags in your response.",
				},
				{
					role: "user",
					content: `Generate an SEO friendly title and SEO friendly meta description for the following blog post:       
          ${postContent}
          ---
          The output json must be in the following format:
          {
            "title": "example title",
            "metaDescription": "example meta description"
          }
          `,
				},
			],
		});

		const seoData = JSON.parse(
			seoResponse.data.choices[0]?.message?.content
		);

		const { title, metaDescription } = seoData;

		res.status(200).json({ post: { postContent, title, metaDescription } });
	} catch (error) {
		console.error("Error generating blog post:", error);
		res.status(500).json({ error: "Failed to generate blog post" });
	}
}
