import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { OpenAIApi, Configuration } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired( async function handler(req, res) {
  const {user} = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("BlogAI");
  console.log(user.sub)

  const userProfile = await db.collection("users").findOne({auth0id: user.sub});
  console.log(userProfile)

  if(!userProfile?.availableTokens){
    res.status(403).json({error: "Not enough tokens"});
    return;
  }

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
      response_format: {type:"json_object"},
		});

		const seoData =
			seoResponse.data.choices[0]?.message?.content || {};

		const { title, metaDescription } = seoData;

    await db.collection("users").updateOne({ 
      auth0Id: user.sub 
    }, { 
      $inc: { 
        availableTokens: -1
      } 
    });
    

    const post = await db.collection("posts").insertOne({
      postContent,
      title,
      metaDescription,
      topic,
      keywords,
      userId: userProfile._id,
      created: new Date()
    })

		res.status(200).json({ post: { postContent, title, metaDescription } });
	} catch (error) {
		console.error("Error generating blog post:", error);
		res.status(500).json({ error: "Failed to generate blog post" });
	}
})