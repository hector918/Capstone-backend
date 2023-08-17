function listen_to_sse(response, stream_handler, onEnd) {
  response.then(resp => {
    resp.data.on('data', data => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (line.trim() === "") continue;
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          //on end
          stream_handler({onEnd: true});
          if(onEnd) onEnd();
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
          console.error(error);
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
