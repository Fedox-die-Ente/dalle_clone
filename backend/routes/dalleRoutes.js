import express from 'express';
import * as dotenv from 'dotenv';
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

dotenv.config();

const router = express.Router();

// const response = await replicate.run(
//   "ai-forever/kandinsky-2.2:ea1addaab376f4dc227f5368bbd8eff901820fd1cc14ed8cad63b29249e9d463",
//   {
//     input: {
//       width: 1024,
//       height: 1024,
//       prompt: 'deine mom',
//       num_outputs: 1,
//       num_inference_steps: 50
//     }
//   }
// );

router.route('/').get((req, res) => {
  res.send("Hello from Image Generation Backend!")
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body

    const aiResponse = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          width: 1024,
          height: 1024,
          prompt: prompt,
          num_outputs: 1,
          num_inference_steps: 50
        }
      }
    );

    const imageUrls = aiResponse;

    if (!imageUrls || imageUrls.length === 0) {
      throw new Error('No output from the API');
    }

    const imageUrl = imageUrls[0];

    res.status(200).json({ photo: imageUrl });
  } catch (error) {
    console.log(`Error generating image: ${error}`);
    res.status(500).send(error?.response.data.error.message)
  }
})

export default router;