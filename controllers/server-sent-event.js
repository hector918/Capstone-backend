function listen_to_sse(response, stream_handler) {
  response.then(resp => {
    resp.data.on('data', data => {
      
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (line.trim() === "") continue;
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          //on end
          stream_handler({onEnd: true});
          return;
        }
        try {
          const parsed = JSON.parse(message);
          const {content} = parsed?.choices[0]?.delta;
          const {finish_reason} = parsed?.choices[0];
          //on data
          stream_handler({data: {content, finish_reason}});
        } catch (error) {
          //on error
          stream_handler(error);
          return;
        }
      }
    });
  })
  .catch(error => {
    console.log("on sse error", error);
    //on error
    stream_handler(error);
  });
}


function hosting_sse(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  //if client close res also close;
  req.on('close', () => {
    console.log("on server-sent-event req close, then close res");
    res.end();
  });
  return (data) => {
    //check the responese here
    if(data.data){
      //success
      res.write(JSON.stringify(data)+ "\n");
    }else if(data.onEnd){
      //event end
      res.write(JSON.stringify({data: "\n", onEnd: true}));
      res.end();
    }else{
      //on error
      res.status(500).write(JSON.stringify({error: data.message}));
      res.end();
    }
  }
}

module.exports = { listen_to_sse, hosting_sse }

/**
 * example code from https://betterprogramming.pub/openai-sse-sever-side-events-streaming-api-733b8ec32897
 * 
 * 
const express = require('express')
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send(`
      <!DOCTYPE html>
    <html>
        <body>
        <h1>response:</h1>
        <div id="result"></div>
        <script>
        var source = new EventSource("/completion");
        source.onmessage = function(event) {
            document.getElementById("result").innerHTML += event.data + "<br>";
        };
        </script>
        </body>
    </html>
    `)
})

app.get('/completion', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    const response = openai.createCompletion({
        model: "text-davinci-003",
        prompt: "hello world",
        max_tokens: 100,
        temperature: 0,
        stream: true,
    }, { responseType: 'stream' });

    response.then(resp => {
        resp.data.on('data', data => {
            const lines = data.toString().split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
                const message = line.replace(/^data: /, '');
                if (message === '[DONE]') {
                    res.end();
                    return
                }
                const parsed = JSON.parse(message);
                res.write(`data: ${parsed.choices[0].text}\n\n`)
            }
        });
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
 */