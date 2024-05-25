import { OpenAIApi, Configuration } from "openai";

export default async function handler(req, res) {
	const config = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});

	const openai = new OpenAIApi(config);

	const topic = "Dog ownership";
	const keywords = "puppies, training, breeds, health, food";

	try {
		const response = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"You are an SEO friendly blog post generator called BlogAI. You are designed to output markdown without formatting. Unsure it is a .md",
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

		const generatedContent = response.data.choices[0]?.message?.content;

		res.status(200).json({ content: generatedContent });
	} catch (error) {
		console.error("Error generating blog post:", error);
		res.status(500).json({ error: "Failed to generate blog post" });
	}
}
