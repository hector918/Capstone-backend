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

async function chatCompletion(question, context, max_token, level = undefined) {
  try {
    //level context
    const level_context = level_helper(level);
    //get completion
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
          content: `Answer the question based on the context below give it in detail, and if the question can't be answered based on the context, say \"I don't know\"\n${level_context}
          \nContext: ${context}\n\n---\n\nQuestion: ${question}\nAnswer:`,
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

async function get_translation(prompt, language = 'english', level = "2", max_token = 2000) {
  try {
    const level_context = level_helper(level);
    // example of level context "use simplified A0-level words to answer";
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: max_token,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [
        {
          //
          role: "system",
          content: `I want you to act as an ${language} translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in ${language}. I want you to ${level_context}. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. `,
        },
        {
          role: "user",
          content: `My first Paragraph is "${prompt}"`,
        },
      ],
    });
    return completion.data;
  } catch (error) {
    console.log(error);
    return false;
  }
  /* response example
  {"id":"chatcmpl-7KwhVgG5uasdKy73p3qBYFRzdX6g0","object":"chat.completion","created":1685226561,"model":"gpt-3.5-turbo-0301","usage":{"prompt_tokens":1419,"completion_tokens":807,"total_tokens":2226},"choices":[{"message":{"role":"assistant","content":"For
  anything, people hope that those who know the truth can reveal it. Although many people have some understanding of the
  Chinese, few can speak of the whole truth. This is because no matter how rich a person's knowledge is, it is impossible
  to understand all aspects of the Chinese. Therefore, this book will face challenges from three different
  perspectives.\n\nThe first perspective believes that it is a waste of effort to try to show the character of the Chinese
  people. Mr. Cook, a journalist for the London Times, visited China in 1857-1858 and, like all writers who came to China,
  saw Chinese people living in various environments and learned about them through knowledgeable people. Later, Mr. Cook
  described the character of the Chinese people in the preface to his collection of letters. However, he admitted that he
  was not satisfied with his description and felt sorry for it. \"When it comes to the character of the Chinese, there are
  some good articles related to it, but I did not use them in my letters, which is really careless. This topic is not only
  very attractive, but also has a lot of room for expansion, which can allow people to make clever associations and
  profound generalizations, and then make correct judgments. But I was not inspired by it at all. If those picky people
  knew about this, they would definitely blame me. In fact, I originally wrote several good qualities of the Chinese
  people, but when I wrote these letters, all I saw were the rough words and deeds of the Chinese people. In order to
  ensure authenticity, I burned several of the good letters. However, there is one thing I have to say. I know several
  sinologists who are not only excellent in their profession, but also frank in their character. When I talked to them
  about this, they agreed with my view that the character of the Chinese people cannot be summarized in one word. Of
  course, only sinologists who truly understand the Chinese people will encounter such difficult problems. As for those
  \"smart\" writers, they can completely bypass the topic and write some unrealistic arguments with flashy words. To be
  honest, the Chinese people do have contradictions in their character. However, now I am asked to make a comprehensive
  and accurate analysis and evaluation of them, but I feel that I am not capable enough. At present, all I can do is to
  describe the Chinese people with this constant factor of character and avoid giving them a precise definition. If I can
  do this, I am already satisfied.\"\n\nIn the past thirty years, the position of the Chinese people in international
  affairs has become increasingly important. They are not afraid of any pressure, which is really incomprehensible.
  Indeed, foreigners can only truly understand the Chinese people in China. Foreigners generally admit that they cannot
  figure out the Chinese people. However, no matter what, we have been dealing with the Chinese people for hundreds of
  years, so we have reason to believe that studying the Chinese people is the same as exploring other complex
  situations.\n\nThe second perspective believes that the author of this book is not qualified to write such a book at
  all. This opposition is very strong. Yes, I have only lived in China for 22 years, so I am indeed lacking in the ability
  to successfully write about the character of the Chinese people. My situation is like that of a miner who only knows how
  to work hard. Although this miner has been working hard in a silver mine for 22 years, he may not have the ability to
  write a paper on metallurgy or the gold-silver standard. China is so big, and I have only lived in two provinces, and
  have not visited less than half of the provinces, so of course I am not qualified to comment on it. These letters were
  originally only for readers of the Shanghai Zilin Xibao, but later, some topics aroused the interest of people in the
  United Kingdom, the United States, Canada, and other countries, so I complied with their strong request to collect these
  letters and publish them."},"finish_reason":"stop","index":0}]}
  
  */
}

//kayrn's work
async function get_an_image(prompt) {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });
    return save_image_to_local(prompt, response.data);
  } catch (error) {
    console.log(error.response?.data?.error);
    return false;
  }
}

// jeans work
async function explainText(words, max_token = 2000) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: max_token,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [
        {
          role: "user",
          content: `Explain this word/sentence to me "${words}" and if the question can't be answered say \"I don't know\"\n\nAnswer:`,
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
  /* result example
    {
      id: 'chatcmpl-7GWWlbCsQ7E6BiGmpiXaNk4Ex1r2W',
      object: 'chat.completion',
      created: 1684172639,
      model: 'gpt-3.5-turbo-0301',
      usage: { prompt_tokens: 38, completion_tokens: 12, total_tokens: 50 },
      choices: [ { message: [Object], finish_reason: 'stop', index: 0 } ]
    }
    */
}

//helper below////////////////////////////////////////////
function save_image_to_local(prompt, openai_dalle_response){
  /**
   * success response
   *  {
    created: 1685991077,
    data: [
      {
        url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-W3qTiYheuLe3KAAPdSI9HPnU/user-3AejdC7ysjGYoB9y8AWhpnCD/img-nsjqggdzIk7aIWWzxkjm7MvC.png?st=2023-06-05T17%3A51%3A17Z&se=2023-06-05T19%3A51%3A17Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-06-05T16%3A36%3A02Z&ske=2023-06-06T16%3A36%3A02Z&sks=b&skv=2021-08-06&sig=jArkLtedIYRebLQkfjhOs5oofdHXyQlZqXJlbbe7IZU%3D'
      }
    ]
  }

  /// error response
  {
    code: null,
    message: 'Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.',
    param: null,
    type: 'invalid_request_error'
  }
  */
  //
  if(openai_dalle_response.created){
    //success

    const alt_img_hash = createSHA256Hash(prompt + openai_dalle_response['data'][0]['url']);
    
    const metaData = {...openai_dalle_response, prompt, timestamp: Date()};

    save_img_to_file(openai_dalle_response['data'][0]['url'], alt_img_hash, metaData);

    openai_dalle_response.data.push({url: alt_img_hash});
  }else{
    //failed
    openai_dalle_response['error'] = "true";
  }
  console.log(openai_dalle_response);
  return openai_dalle_response;
  ////////////////////////////////////////
  function save_img_to_file(url, fileHash, metaData){

    const http = require('https');
    const fs = require('fs');
    const path_prefix = `${__dirname}/../img-files/`;
    const destinationPath = path_prefix + fileHash;
    const file = fs.createWriteStream(destinationPath);
    http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(function() {
          fs.writeFile(destinationPath + ".metadata", JSON.stringify(metaData), ()=>{});
        });
      });
    }).on('error', function(err) {
      fs.unlink(destinationPath, function() {
        console.error('Error while downloading the file:', err.message);
      });
    });
  }
  function createSHA256Hash(data) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
}

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
function level_helper(level){
  switch(level){
    case "1":
      return "use simplified Elementary level of words to answer";
    case "3":
      return "use Advanced and Unabridged words to answer";
    default:
      return ""
  }
  /* a0
    {"id":"chatcmpl-7KsUPOXUIRzGWS5xopze4GuTc2oIi","object":"chat.completion","created":1685210373,"model":"gpt-3.5-turbo-0301","usage":{"prompt_tokens":1993,"completion_tokens":99,"total_tokens":2092},"choices":[{"message":{"role":"assistant","content":"The
    book \"The Old Man and the Sea\" features various types of fish, including tuna, dolphin, flying fish, and squid. The
    old man in the story is trying to catch a giant marlin, which he describes as having a huge eye and purple stripes. The
    marlin is also accompanied by two gray sucking fish that swim around him. The old man also encounters porpoises and
    observes their behavior. Overall, the book portrays the ocean and its inhabitants as both beautiful and
    cruel."},"finish_reason":"stop","index":0}],"level":"1"}

    level default
    {"id":"chatcmpl-7KsWI9rAaQkRXb9Zyyy0EGWKEEukX","object":"chat.completion","created":1685210490,"model":"gpt-3.5-turbo-0301","usage":{"prompt_tokens":1984,"completion_tokens":129,"total_tokens":2113},"choices":[{"message":{"role":"assistant","content":"The
    book \"The Old Man and the Sea\" by Ernest Hemingway features various types of fish, including a giant marlin, tuna,
    dolphin fish, flying fish, porpoises, and schools of squid. The old man in the story is primarily focused on catching
    the giant marlin, which he struggles with for days. The book also mentions the gray sucking fish that swim around the
    marlin and attach themselves to it at times. The old man also reflects on the delicate and fine sea swallows and the
    cruelty of the ocean towards them. Overall, the book portrays a vivid and detailed picture of the marine life in the
    ocean."},"finish_reason":"stop","index":0}],"level":"2"}

    C3
    {"id":"chatcmpl-7KwZx6dUQx0tRhGZZ3pXXMBG34P3G","object":"chat.completion","created":1685226093,"model":"gpt-3.5-turbo-0301","usage":{"prompt_tokens":1990,"completion_tokens":150,"total_tokens":2140},"choices":[{"message":{"role":"assistant","content":"In
    the book \"The Old Man and the Sea\" by Ernest Hemingway, there are several types of fish mentioned. The main fish that
    the old man is trying to catch is a giant marlin, which is described as having a huge bulk, purple stripes, a dorsal
    fin, and large pectoral fins. The old man also mentions catching tuna, which are referred to as all fish of that species
    and distinguished by their proper names when sold or traded for bait. Additionally, there are schools of squid in the
    deepest holes, and flying fish are mentioned as the old man's principal friends on the ocean. The old man also sees two
    gray sucking fish that swim around the marlin, and two porpoises come around his
    boat."},"finish_reason":"stop","index":0}],"level":"3"}
  */
}
module.exports = {
  get_embedding,
  cosineDistance,
  embedding_result_templete,
  list_models,
  chatCompletion,
  get_an_image,
  explainText,
  get_translation
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
