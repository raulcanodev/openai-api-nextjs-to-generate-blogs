import {
	handleAuth,
	handleCallback,
	afterCallback,
	getSession,
} from "@auth0/nextjs-auth0";
import clientPromise from "../../../lib/mongodb";

const authOptions = {
	async callback(req, res) {
		try {
			await handleCallback(req, res, { afterCallback });
			const { user } = await getSession(req, res);
			const client = await clientPromise;
			const db = client.db("BlogAI");
			await db.collection("users").updateOne(
				{ auth0Id: user.sub },
				{
					$setOnInsert: {
						auth0id: user.sub,
						availableTokens: 5,
					},
				},
				{ upsert: true }
			);
		} catch (error) {
			console.log(error);
		}
	},
};

export default handleAuth(authOptions);
