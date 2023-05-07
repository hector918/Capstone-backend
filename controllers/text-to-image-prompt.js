const { Configuration, OpenAIApi } = require("openai");
const { openai_api_key } = require("../token.js");
const configuration = new Configuration({ apiKey: openai_api_key }); 
const openai = new OpenAIApi(configuration);

async function get_an_image(prompt) {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    return response;
  } catch (error) {
    console.log(error);
    console.log(error.response.data.error)
  }
}

module.exports = { get_an_image };
