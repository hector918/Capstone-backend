const {Configuration, OpenAIApi} = require("openai");
const {openai_api_key} = require('../token');
const openai = new OpenAIApi(new Configuration({apiKey: openai_api_key}));
//////////////////////////////////////////////////////////
async function get_embedding(prompt){
  try {
    const ret = await openai.createEmbedding({
      input: prompt,
      model: 'text-embedding-ada-002',
    });
    return ret.data;
  } catch (error) {
    console.log('openai get_embedding error: ', error?.responsea?.data || false);
  }
  return false;
}

module.exports = { get_embedding }