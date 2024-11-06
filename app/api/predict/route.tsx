import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { model_type, age, glucose, insulin, bmi } = req.body;

            const response = await fetch("https://diabetesapi-mr-malik-aryan-mrmalikaryans-projects.vercel.app/predict", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": "_vercel_sso_nonce=CBw42YmtOi4vJCJ6WAHiIDvJ"
                },
                body: JSON.stringify({
                    model_type,
                    age,
                    glucose,
                    insulin,
                    bmi
                }),
            });

            const data = await response.json();

            // Handle the response from the external API
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch data');
            }

            return res.status(200).json(data);
        } catch (error) {
            console.error('Error processing request:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
