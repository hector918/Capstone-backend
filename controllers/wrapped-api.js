const { Configuration, OpenAIApi } = require("openai");
const { openai_api_key } = require("../token.js");
// const { response } = require("../app.js");
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
async function chatCompletion(model, messages, temperature) {
  try {
    const response = openai.createChatCompletion({
      model,
      messages,
      temperature,
      //use stream
      stream: true
    }, { responseType: 'stream' });
    return response;
  } catch (error) {
    return false;
  }


}
async function chatCompletionForRC(question, context, max_token, level = undefined) {
  try {
    //level context
    const level_context = level_helper(level);
    //get completion
    const completion = await openai.createChatCompletion({
      // model: "gpt-3.5-turbo",
      // model: "gpt-3.5-turbo-16k",
      model: "gpt-3.5-turbo-16k-0613",
      temperature: 0,
      max_tokens: max_token,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [
        {
          role: "system",
          content: "You are reading comprehension AI robot assistant, you use the same language as the question and return the output in a csv/Markdown format.",
        },
        {
          role: "user",
          content: `Answer the question based on the context below and give it in detail , and if the question can't be answered based on the context, say \"I don't know\"\n${level_context}
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
    //get image from openai by prompt
    const response = await openai.createImage({
      prompt: prompt_helper(prompt),
      n: 1,
      size: "512x512",
    });
    //save and return image url
    return save_image_to_local(prompt, response.data);
  } catch (error) {
    console.log(error.response?.data?.error);
    return false;
  }
  function prompt_helper(input) {
    return `${input}, in the real world`
  }
}

// jeans work
async function explainText(words, language = 'english', max_token = 2000) {
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
          content: `Explain this word/sentence to me in ${language}, and your Explanation must be in ${language}`
        },
        {
          role: "user",
          content: `"${words}"`,
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
function save_image_to_local(prompt, openai_dalle_response) {
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
  if (openai_dalle_response.created) {
    //success

    const alt_img_hash = createSHA256Hash(prompt + openai_dalle_response['data'][0]['url']);

    const metaData = { ...openai_dalle_response, prompt, timestamp: Date() };

    save_img_to_file(openai_dalle_response['data'][0]['url'], alt_img_hash, metaData);

    openai_dalle_response.data.push({ url: alt_img_hash });
  } else {
    //failed
    openai_dalle_response['error'] = "true";
  }
  console.log(openai_dalle_response);
  return openai_dalle_response;
  ////////////////////////////////////////
  function save_img_to_file(url_to_image, fileHash, metaData) {
    const https = require('https');
    const fs = require('fs');
    const parsedUrl = new URL(url_to_image);
    parsedUrl.hostname = "oaidalleapiprodscus.blob.core.windows.net";

    const path_prefix = `${__dirname}/../img-files/`;
    const destinationPath = path_prefix + fileHash;
    const file = fs.createWriteStream(destinationPath);
    //download image from remote
    https.get(parsedUrl.toString(), function (response) {
      response.pipe(file);
      file.on('finish', function () {
        file.close(function () {
          //save file
          fs.writeFile(destinationPath + ".metadata", JSON.stringify(metaData), () => { });
        });
      });
    }).on('error', function (err) {
      //remove local image if error occur
      fs.unlink(destinationPath, function () {
        console.error('Error while downloading the file:', err.message);
      });
    });
    /**
     * example URL object{
  href: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-W3qTiYheuLe3KAAPdSI9HPnU/user-3AejdC7ysjGYoB9y8AWhpnCD/img-cGhY2j42IaobYES60DVhpV1z.png?st=2023-10-03T13%3A48%3A21Z&se=2023-10-03T15%3A48%3A21Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-03T12%3A19%3A52Z&ske=2023-10-04T12%3A19%3A52Z&sks=b&skv=2021-08-06&sig=3kuKE5oONmDcq0%2BlJ6FNoAlp4wO90Utx7l44VASGM0c%3D',
  origin: 'https://oaidalleapiprodscus.blob.core.windows.net',
  protocol: 'https:',
  username: '',
  password: '',
  host: 'oaidalleapiprodscus.blob.core.windows.net',
  hostname: 'oaidalleapiprodscus.blob.core.windows.net',
  port: '',
  pathname: '/private/org-W3qTiYheuLe3KAAPdSI9HPnU/user-3AejdC7ysjGYoB9y8AWhpnCD/img-cGhY2j42IaobYES60DVhpV1z.png',
  search: '?st=2023-10-03T13%3A48%3A21Z&se=2023-10-03T15%3A48%3A21Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-03T12%3A19%3A52Z&ske=2023-10-04T12%3A19%3A52Z&sks=b&skv=2021-08-06&sig=3kuKE5oONmDcq0%2BlJ6FNoAlp4wO90Utx7l44VASGM0c%3D',
  searchParams: URLSearchParams {
    'st' => '2023-10-03T13:48:21Z',
    'se' => '2023-10-03T15:48:21Z',
    'sp' => 'r',
    'sv' => '2021-08-06',
    'sr' => 'b',
    'rscd' => 'inline',
    'rsct' => 'image/png',
    'skoid' => '6aaadede-4fb3-4698-a8f6-684d7786b067',
    'sktid' => 'a48cca56-e6da-484e-a814-9c849652bcb3',
    'skt' => '2023-10-03T12:19:52Z',
    'ske' => '2023-10-04T12:19:52Z',
    'sks' => 'b',
    'skv' => '2021-08-06',
    'sig' => '3kuKE5oONmDcq0+lJ6FNoAlp4wO90Utx7l44VASGM0c=' },
  hash: ''
}
     */
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
function level_helper(level) {
  //get level prompt from level parameter
  switch (level) {
    case "1":
      return "use simplified Elementary level of words to answer";
    case "3":
      return "use professional terms to answer";
    default:
      return ""
  }
  /* 
  a3:

Bitemporal
hemianopsia is a visual field defect that occurs due to a lesion at the optic chiasm. The optic chiasm is the point
where the optic nerves from each eye cross over. Lesions at the optic chiasm can be caused by various conditions such as
tumors, aneurysms, or inflammation. These lesions can compress or damage the optic nerves, leading to the loss of
peripheral vision on both sides (temporal fields) while preserving central vision. Bitemporal hemianopsia can be
diagnosed through visual field examination using the confrontation method or through imaging techniques such as CT
angiography.
Bitemporal
hemianopsia is a condition where there is loss of vision in the outer half of the visual field in both eyes. It is
typically caused by a lesion at the optic chiasm, which is the point where the optic nerves from each eye cross over.
This can occur due to various reasons such as tumors, pituitary gland disorders, or other conditions that affect the
optic
chiasm."
  */
}
module.exports = {
  get_embedding,
  cosineDistance,
  embedding_result_templete,
  list_models,
  chatCompletionForRC,
  get_an_image,
  explainText,
  get_translation,
  chatCompletion
};
