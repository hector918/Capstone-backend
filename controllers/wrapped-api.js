const { Configuration, OpenAIApi } = require("openai");
const { openai_api_key } = require("../token.js");
const openai = new OpenAIApi(new Configuration({ apiKey: openai_api_key }));
//core function of openAI////////////////////////////////////////////////////////
async function get_embedding(prompt) {
  try {
    const ret = await openai.createEmbedding({
      input: prompt,
      model: "text-embedding-ada-002",
    });
    return ret.data;
  } catch (error) {
    console.log(
      "openai get_embedding error: ",
      error?.responsea?.data || false
    );
    return false;
  }
}

async function list_models() {
  try {
    const completion = await openai.listModels({});
    return completion.data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function chatCompletion(question, context, max_token) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: max_token,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [
        {
          role: "system",
          content: "You are reading comprehension AI robot assistant",
        },
        {
          role: "user",
          content: `Answer the question based on the context below give it in detail, and if the question can't be answered based on the context, say \"I don't know\"\n\nContext: ${context}\n\n---\n\nQuestion: ${question}\nAnswer:`,
        },
      ],
    });
    return completion.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    return false;
  }
}

//kayrn's work
async function get_an_image(prompt) {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });
    return response.data;
  } catch (error) {
    console.log(error.response?.data?.error);
    return false;
  }
}

//helper below////////////////////////////////////////////
function embedding_result_templete(text, raw_res) {
  return {
    text: text,
    usage: raw_res.usage,
    embedding: raw_res.data[0].embedding,
  };
}

function cosineDistance(u, v, w = null) {
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
  // Compute the cosine distance
  return dotProduct / (Math.sqrt(magnitudeU) * Math.sqrt(magnitudeV));
}

module.exports = {
  get_embedding,
  cosineDistance,
  embedding_result_templete,
  list_models,
  chatCompletion,
  get_an_image,
};

/* //list model result example
[
  {
    id: 'babbage',
    object: 'model',
    created: 1649358449,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'babbage',
    parent: null
  },
  {
    id: 'davinci',
    object: 'model',
    created: 1649359874,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'davinci',
    parent: null
  },
  {
    id: 'text-davinci-edit-001',
    object: 'model',
    created: 1649809179,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'text-davinci-edit-001',
    parent: null
  },
  {
    id: 'babbage-code-search-code',
    object: 'model',
    created: 1651172509,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'babbage-code-search-code',
    parent: null
  },
  {
    id: 'text-similarity-babbage-001',
    object: 'model',
    created: 1651172505,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-similarity-babbage-001',
    parent: null
  },
  {
    id: 'code-davinci-edit-001',
    object: 'model',
    created: 1649880484,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'code-davinci-edit-001',
    parent: null
  },
  {
    id: 'text-davinci-001',
    object: 'model',
    created: 1649364042,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'text-davinci-001',
    parent: null
  },
  {
    id: 'ada',
    object: 'model',
    created: 1649357491,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'ada',
    parent: null
  },
  {
    id: 'babbage-code-search-text',
    object: 'model',
    created: 1651172509,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'babbage-code-search-text',
    parent: null
  },
  {
    id: 'babbage-similarity',
    object: 'model',
    created: 1651172505,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'babbage-similarity',
    parent: null
  },
  {
    id: 'code-search-babbage-text-001',
    object: 'model',
    created: 1651172507,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'code-search-babbage-text-001',
    parent: null
  },
  {
    id: 'text-curie-001',
    object: 'model',
    created: 1649364043,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'text-curie-001',
    parent: null
  },
  {
    id: 'code-search-babbage-code-001',
    object: 'model',
    created: 1651172507,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'code-search-babbage-code-001',
    parent: null
  },
  {
    id: 'text-ada-001',
    object: 'model',
    created: 1649364042,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'text-ada-001',
    parent: null
  },
  {
    id: 'text-embedding-ada-002',
    object: 'model',
    created: 1671217299,
    owned_by: 'openai-internal',
    permission: [ [Object] ],
    root: 'text-embedding-ada-002',
    parent: null
  },
  {
    id: 'text-similarity-ada-001',
    object: 'model',
    created: 1651172505,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-similarity-ada-001',
    parent: null
  },
  {
    id: 'curie-instruct-beta',
    object: 'model',
    created: 1649364042,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'curie-instruct-beta',
    parent: null
  },
  {
    id: 'ada-code-search-code',
    object: 'model',
    created: 1651172505,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'ada-code-search-code',
    parent: null
  },
  {
    id: 'ada-similarity',
    object: 'model',
    created: 1651172507,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'ada-similarity',
    parent: null
  },
  {
    id: 'gpt-3.5-turbo-0301',
    object: 'model',
    created: 1677649963,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'gpt-3.5-turbo-0301',
    parent: null
  },
  {
    id: 'code-search-ada-text-001',
    object: 'model',
    created: 1651172507,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'code-search-ada-text-001',
    parent: null
  },
  {
    id: 'text-search-ada-query-001',
    object: 'model',
    created: 1651172505,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-search-ada-query-001',
    parent: null
  },
  {
    id: 'davinci-search-document',
    object: 'model',
    created: 1651172509,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'davinci-search-document',
    parent: null
  },
  {
    id: 'gpt-3.5-turbo',
    object: 'model',
    created: 1677610602,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'gpt-3.5-turbo',
    parent: null
  },
  {
    id: 'ada-code-search-text',
    object: 'model',
    created: 1651172510,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'ada-code-search-text',
    parent: null
  },
  {
    id: 'text-search-ada-doc-001',
    object: 'model',
    created: 1651172507,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-search-ada-doc-001',
    parent: null
  },
  {
    id: 'davinci-instruct-beta',
    object: 'model',
    created: 1649364042,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'davinci-instruct-beta',
    parent: null
  },
  {
    id: 'text-similarity-curie-001',
    object: 'model',
    created: 1651172507,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-similarity-curie-001',
    parent: null
  },
  {
    id: 'code-search-ada-code-001',
    object: 'model',
    created: 1651172507,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'code-search-ada-code-001',
    parent: null
  },
  {
    id: 'ada-search-query',
    object: 'model',
    created: 1651172505,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'ada-search-query',
    parent: null
  },
  {
    id: 'text-search-davinci-query-001',
    object: 'model',
    created: 1651172505,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-search-davinci-query-001',
    parent: null
  },
  {
    id: 'curie-search-query',
    object: 'model',
    created: 1651172509,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'curie-search-query',
    parent: null
  },
  {
    id: 'davinci-search-query',
    object: 'model',
    created: 1651172505,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'davinci-search-query',
    parent: null
  },
  {
    id: 'babbage-search-document',
    object: 'model',
    created: 1651172510,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'babbage-search-document',
    parent: null
  },
  {
    id: 'ada-search-document',
    object: 'model',
    created: 1651172507,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'ada-search-document',
    parent: null
  },
  {
    id: 'text-search-curie-query-001',
    object: 'model',
    created: 1651172509,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-search-curie-query-001',
    parent: null
  },
  {
    id: 'whisper-1',
    object: 'model',
    created: 1677532384,
    owned_by: 'openai-internal',
    permission: [ [Object] ],
    root: 'whisper-1',
    parent: null
  },
  {
    id: 'text-search-babbage-doc-001',
    object: 'model',
    created: 1651172509,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-search-babbage-doc-001',
    parent: null
  },
  {
    id: 'curie-search-document',
    object: 'model',
    created: 1651172508,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'curie-search-document',
    parent: null
  },
  {
    id: 'text-davinci-003',
    object: 'model',
    created: 1669599635,
    owned_by: 'openai-internal',
    permission: [ [Object] ],
    root: 'text-davinci-003',
    parent: null
  },
  {
    id: 'text-search-curie-doc-001',
    object: 'model',
    created: 1651172509,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-search-curie-doc-001',
    parent: null
  },
  {
    id: 'babbage-search-query',
    object: 'model',
    created: 1651172509,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'babbage-search-query',
    parent: null
  },
  {
    id: 'text-babbage-001',
    object: 'model',
    created: 1649364043,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'text-babbage-001',
    parent: null
  },
  {
    id: 'text-search-davinci-doc-001',
    object: 'model',
    created: 1651172505,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-search-davinci-doc-001',
    parent: null
  },
  {
    id: 'text-search-babbage-query-001',
    object: 'model',
    created: 1651172509,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-search-babbage-query-001',
    parent: null
  },
  {
    id: 'curie-similarity',
    object: 'model',
    created: 1651172510,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'curie-similarity',
    parent: null
  },
  {
    id: 'curie',
    object: 'model',
    created: 1649359874,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'curie',
    parent: null
  },
  {
    id: 'text-similarity-davinci-001',
    object: 'model',
    created: 1651172505,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'text-similarity-davinci-001',
    parent: null
  },
  {
    id: 'text-davinci-002',
    object: 'model',
    created: 1649880484,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'text-davinci-002',
    parent: null
  },
  {
    id: 'davinci-similarity',
    object: 'model',
    created: 1651172509,
    owned_by: 'openai-dev',
    permission: [ [Object] ],
    root: 'davinci-similarity',
    parent: null
  },
  {
    id: 'cushman:2020-05-03',
    object: 'model',
    created: 1590625110,
    owned_by: 'system',
    permission: [ [Object] ],
    root: 'cushman:2020-05-03',
    parent: null
  },
  {
    id: 'ada:2020-05-03',
    object: 'model',
    created: 1607631625,
    owned_by: 'system',
    permission: [ [Object] ],
    root: 'ada:2020-05-03',
    parent: null
  },
  {
    id: 'babbage:2020-05-03',
    object: 'model',
    created: 1607632611,
    owned_by: 'system',
    permission: [ [Object] ],
    root: 'babbage:2020-05-03',
    parent: null
  },
  {
    id: 'curie:2020-05-03',
    object: 'model',
    created: 1607632725,
    owned_by: 'system',
    permission: [ [Object] ],
    root: 'curie:2020-05-03',
    parent: null
  },
  {
    id: 'davinci:2020-05-03',
    object: 'model',
    created: 1607640163,
    owned_by: 'system',
    permission: [ [Object] ],
    root: 'davinci:2020-05-03',
    parent: null
  },
  {
    id: 'if-davinci-v2',
    object: 'model',
    created: 1610745990,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'if-davinci-v2',
    parent: null
  },
  {
    id: 'if-curie-v2',
    object: 'model',
    created: 1610745968,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'if-curie-v2',
    parent: null
  },
  {
    id: 'if-davinci:3.0.0',
    object: 'model',
    created: 1629420755,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'if-davinci:3.0.0',
    parent: null
  },
  {
    id: 'davinci-if:3.0.0',
    object: 'model',
    created: 1629498070,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'davinci-if:3.0.0',
    parent: null
  },
  {
    id: 'davinci-instruct-beta:2.0.0',
    object: 'model',
    created: 1629501914,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'davinci-instruct-beta:2.0.0',
    parent: null
  },
  {
    id: 'text-ada:001',
    object: 'model',
    created: 1641949608,
    owned_by: 'system',
    permission: [ [Object] ],
    root: 'text-ada:001',
    parent: null
  },
  {
    id: 'text-davinci:001',
    object: 'model',
    created: 1641943966,
    owned_by: 'system',
    permission: [ [Object] ],
    root: 'text-davinci:001',
    parent: null
  },
  {
    id: 'text-curie:001',
    object: 'model',
    created: 1641955047,
    owned_by: 'system',
    permission: [ [Object] ],
    root: 'text-curie:001',
    parent: null
  },
  {
    id: 'text-babbage:001',
    object: 'model',
    created: 1642018370,
    owned_by: 'openai',
    permission: [ [Object] ],
    root: 'text-babbage:001',
    parent: null
  }
]

*/
