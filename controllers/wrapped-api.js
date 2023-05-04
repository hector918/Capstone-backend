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

function embedding_result_templete(text, raw_res){
  return {text: text, usage: raw_res.usage, embedding: raw_res.data[0].embedding}
}

function cosineDistance(u, v, w=null) {
  console.log(u.length, v.length)
  // Check if the arrays have the same length
  if (u.length !== v.length) {
    throw "Arrays must have the same length";
  }
  
  // Compute the dot product of u and v
  let dotProduct = 0;
  for (let i = 0; i < u.length; i++) {
    if (w === null) {
      dotProduct += u[i] * v[i];
    } else {
      dotProduct += w[i] * u[i] * v[i];
    }
  }
  
  // Compute the magnitude of u and v
  let magnitudeU = 0;
  let magnitudeV = 0;
  for (let i = 0; i < u.length; i++) {
    if (w === null) {
      magnitudeU += u[i] * u[i];
      magnitudeV += v[i] * v[i];
    } else {
      magnitudeU += w[i] * u[i] * u[i];
      magnitudeV += w[i] * v[i] * v[i];
    }
  }
  magnitudeU = Math.sqrt(magnitudeU);
  magnitudeV = Math.sqrt(magnitudeV);
  
  // Compute the cosine distance
  let cosineDistance = dotProduct / (magnitudeU * magnitudeV);
  
  return cosineDistance;
}


module.exports = { get_embedding, cosineDistance, embedding_result_templete }