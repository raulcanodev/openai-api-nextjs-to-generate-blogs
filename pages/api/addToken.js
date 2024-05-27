import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	const { user } = await getSession(req, res);

	const client = await clientPromise;
	const db = client.db("BlogAI");

	const userProfile = await db
		.collection("users")
		.updateOne(
			{ auth0id: user.sub },
			{
				$inc: { availableTokens: 1 },
				$setOnInsert: { auth0id: user.sub },
			},
			{ upsert: true },
		);
	res.status(200).json({ name: "John Doe" });
}
