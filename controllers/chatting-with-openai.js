const express = require("express");
const cwo = express.Router();
const { chatCompletion } = require('./wrapped-api');
const { listen_to_sse, hosting_sse } = require('./server-sent-event');
const { verifyUserLogin } = require('./user-control');
const {log_user_action} = require('../queries/user-control');
//////////////////////////////////////////
cwo.post('/openai/SSE', verifyUserLogin, (req, res) => {
  try {
    var { messages, model, temperature } = req.body;
    temperature = Number(temperature) || 1;
    // re-organize user input 
    model = model_str(model);
    messages = filter_messages(messages);
    if(messages === false){
      throw new Error ("user input invalid");
    }
    //send it to api
    const response = chatCompletion(model, messages, temperature);
    //handle openai server sent event 
    if (response) {
      const stream_handler = hosting_sse(req, res);
      listen_to_sse(response, stream_handler, () => {
        //on end, log user action, only log question's length not the content
        log_user_action(req.session.userInfo.userId, 'user asking chatGpt question', JSON.stringify({model, question_length: JSON.stringify(messages).length}));
      });
      //it end's here, the res will be handle by hosting_sse
    }
  } catch (error) {
    console.error(error.message);
    //this is Special for server sent event
    res.status(500).write(JSON.stringify({error: error.message}));
    res.end();
  }
  //openai response handling
})
function filter_messages(messages){
  const template = {role: 10, content: 10000};
  const ret = [];
  for(let row of messages){
    let filtered_row = {};
    for(let key in template){
      if(row[key].length <= template[key]){
        filtered_row[key] = row[key];
      }else{
        return false;
      }
    }
    ret.push(filtered_row);
  }
  return ret;
}
function model_str(model) {
  switch (model) {
    case "02": return "gpt-4-0613";
    default: return "gpt-3.5-turbo-16k";//gpt-3.5-turbo-16k-0613
  }
}
module.exports = cwo;

/**
 * 
 * [{"id":"text-davinci-001","object":"model","created":1649364042,"owned_by":"openai","permission":[{"id":"modelperm-CDlahk1RbkghXDjtxqzXoPNo","object":"model_permission","created":1690913868,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-davinci-001","parent":null},{"id":"text-search-curie-query-001","object":"model","created":1651172509,"owned_by":"openai-dev","permission":[{"id":"modelperm-fNgpMH6ZEQulSq1CjzlfQuIe","object":"model_permission","created":1690864192,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-search-curie-query-001","parent":null},{"id":"davinci","object":"model","created":1649359874,"owned_by":"openai","permission":[{"id":"modelperm-8s5tCuiXSr3zT00nLwZGyMpS","object":"model_permission","created":1690930152,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"davinci","parent":null},{"id":"text-babbage-001","object":"model","created":1649364043,"owned_by":"openai","permission":[{"id":"modelperm-YABzYWjC1kS6M2BnI6Fr9vuS","object":"model_permission","created":1690913878,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-babbage-001","parent":null},{"id":"curie-instruct-beta","object":"model","created":1649364042,"owned_by":"openai","permission":[{"id":"modelperm-4GYfzAdSMcJmQvF7bsw01UWw","object":"model_permission","created":1690863785,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"curie-instruct-beta","parent":null},{"id":"text-davinci-003","object":"model","created":1669599635,"owned_by":"openai-internal","permission":[{"id":"modelperm-a6niqBmW2JaGmo0fDO7FEt1n","object":"model_permission","created":1690930172,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-davinci-003","parent":null},{"id":"davinci-similarity","object":"model","created":1651172509,"owned_by":"openai-dev","permission":[{"id":"modelperm-XHJ9P2cvfDAl6Q6NABs6wD7G","object":"model_permission","created":1690864520,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"davinci-similarity","parent":null},{"id":"code-davinci-edit-001","object":"model","created":1649880484,"owned_by":"openai","permission":[{"id":"modelperm-T8Ie7SvlPyvtsDvPlfC8DftZ","object":"model_permission","created":1690915089,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"code-davinci-edit-001","parent":null},{"id":"text-similarity-curie-001","object":"model","created":1651172507,"owned_by":"openai-dev","permission":[{"id":"modelperm-ZQZGhVQCQSN4WC1wRJsFZfRL","object":"model_permission","created":1690864230,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-similarity-curie-001","parent":null},{"id":"text-embedding-ada-002","object":"model","created":1671217299,"owned_by":"openai-internal","permission":[{"id":"modelperm-F3BGCNGb0ChzFesHIYjbNYUX","object":"model_permission","created":1690865307,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-embedding-ada-002","parent":null},{"id":"ada-code-search-text","object":"model","created":1651172510,"owned_by":"openai-dev","permission":[{"id":"modelperm-jWFKGhnNYXhMIJuYYBe8zKoH","object":"model_permission","created":1690864242,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"ada-code-search-text","parent":null},{"id":"text-search-ada-query-001","object":"model","created":1651172505,"owned_by":"openai-dev","permission":[{"id":"modelperm-YO36k119sJYqPB8yHh737z8l","object":"model_permission","created":1690864529,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-search-ada-query-001","parent":null},{"id":"gpt-4-0314","object":"model","created":1687882410,"owned_by":"openai","permission":[{"id":"modelperm-q9tcAQ9XhBjWdyxhWgFDYPaj","object":"model_permission","created":1691139822,"allow_create_engine":false,"allow_sampling":false,"allow_logprobs":false,"allow_search_indices":false,"allow_view":false,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"gpt-4-0314","parent":null},{"id":"babbage-search-query","object":"model","created":1651172509,"owned_by":"openai-dev","permission":[{"id":"modelperm-o5hcKERXLlTSB0nfq8fPkAzK","object":"model_permission","created":1690864257,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"babbage-search-query","parent":null},{"id":"ada-similarity","object":"model","created":1651172507,"owned_by":"openai-dev","permission":[{"id":"modelperm-Tz8CgePTpeDdl0q0mDxAseS4","object":"model_permission","created":1690864543,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"ada-similarity","parent":null},{"id":"gpt-3.5-turbo","object":"model","created":1677610602,"owned_by":"openai","permission":[{"id":"modelperm-zy5TOjnE2zVaicIcKO9bQDgX","object":"model_permission","created":1690864883,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"gpt-3.5-turbo","parent":null},{"id":"gpt-4-0613","object":"model","created":1686588896,"owned_by":"openai","permission":[{"id":"modelperm-CWAN7JBmKfHDxOehfVPukiEL","object":"model_permission","created":1691615947,"allow_create_engine":false,"allow_sampling":false,"allow_logprobs":false,"allow_search_indices":false,"allow_view":false,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"gpt-4-0613","parent":null},{"id":"text-search-ada-doc-001","object":"model","created":1651172507,"owned_by":"openai-dev","permission":[{"id":"modelperm-WQoo7GOoaleCrrerQ8ROIejy","object":"model_permission","created":1690864068,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-search-ada-doc-001","parent":null},{"id":"text-search-babbage-query-001","object":"model","created":1651172509,"owned_by":"openai-dev","permission":[{"id":"modelperm-PHk5XyJIMEk88v14M2eEcJfE","object":"model_permission","created":1690864079,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-search-babbage-query-001","parent":null},{"id":"code-search-ada-code-001","object":"model","created":1651172507,"owned_by":"openai-dev","permission":[{"id":"modelperm-lPJ8tQWzTuRpZpOjtRN4CjlP","object":"model_permission","created":1690864269,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"code-search-ada-code-001","parent":null},{"id":"curie-search-document","object":"model","created":1651172508,"owned_by":"openai-dev","permission":[{"id":"modelperm-o3nt5yDhE7FpA8PtMlzGuW3k","object":"model_permission","created":1690864552,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"curie-search-document","parent":null},{"id":"text-search-davinci-query-001","object":"model","created":1651172505,"owned_by":"openai-dev","permission":[{"id":"modelperm-X2U9yi1RKudh1hGQ9CnPth2A","object":"model_permission","created":1690864090,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-search-davinci-query-001","parent":null},{"id":"text-search-curie-doc-001","object":"model","created":1651172509,"owned_by":"openai-dev","permission":[{"id":"modelperm-7mOkCIwOIehlltLDPM1oSKN7","object":"model_permission","created":1690864279,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-search-curie-doc-001","parent":null},{"id":"babbage-search-document","object":"model","created":1651172510,"owned_by":"openai-dev","permission":[{"id":"modelperm-FQiAIZXWHZ4yJl6b4X0JWpfw","object":"model_permission","created":1690864561,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"babbage-search-document","parent":null},{"id":"babbage-code-search-text","object":"model","created":1651172509,"owned_by":"openai-dev","permission":[{"id":"modelperm-9AyTgRlbDLetEnvXKDgJvSvR","object":"model_permission","created":1690864101,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"babbage-code-search-text","parent":null},{"id":"davinci-instruct-beta","object":"model","created":1649364042,"owned_by":"openai","permission":[{"id":"modelperm-ZNpXjNy0lDniBWzpvi6w6wSU","object":"model_permission","created":1690842588,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"davinci-instruct-beta","parent":null},{"id":"davinci-search-query","object":"model","created":1651172505,"owned_by":"openai-dev","permission":[{"id":"modelperm-w5yjX7u1Hgz0jJFhPRB93n6I","object":"model_permission","created":1690864112,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"davinci-search-query","parent":null},{"id":"text-similarity-babbage-001","object":"model","created":1651172505,"owned_by":"openai-dev","permission":[{"id":"modelperm-8p0vOyyD6xVDYv6XOC4EYIin","object":"model_permission","created":1690864583,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-similarity-babbage-001","parent":null},{"id":"text-davinci-002","object":"model","created":1649880484,"owned_by":"openai","permission":[{"id":"modelperm-Ao62Dd2uu76ec6Koq1ksR2rj","object":"model_permission","created":1690864376,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-davinci-002","parent":null},{"id":"code-search-babbage-text-001","object":"model","created":1651172507,"owned_by":"openai-dev","permission":[{"id":"modelperm-uH251hsudZq0DqxtTcSYFTcD","object":"model_permission","created":1690864593,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"code-search-babbage-text-001","parent":null},{"id":"babbage","object":"model","created":1649358449,"owned_by":"openai","permission":[{"id":"modelperm-vZIqTaVk4K37PezAFVHAEW3H","object":"model_permission","created":1690943947,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"babbage","parent":null},{"id":"text-search-davinci-doc-001","object":"model","created":1651172505,"owned_by":"openai-dev","permission":[{"id":"modelperm-sqcSr7AYu6WYtzWgysHg1zO4","object":"model_permission","created":1690864126,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-search-davinci-doc-001","parent":null},{"id":"code-search-ada-text-001","object":"model","created":1651172507,"owned_by":"openai-dev","permission":[{"id":"modelperm-1JbI0GFKw9luPgTJQut1uJNe","object":"model_permission","created":1690864601,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"code-search-ada-text-001","parent":null},{"id":"ada-search-query","object":"model","created":1651172505,"owned_by":"openai-dev","permission":[{"id":"modelperm-cBtmsjrTZIJUKgjS8G6uALKM","object":"model_permission","created":1690864138,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"ada-search-query","parent":null},{"id":"text-similarity-ada-001","object":"model","created":1651172505,"owned_by":"openai-dev","permission":[{"id":"modelperm-fSDlSniO72T5MvD6ieDRue0a","object":"model_permission","created":1690864457,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-similarity-ada-001","parent":null},{"id":"whisper-1","object":"model","created":1677532384,"owned_by":"openai-internal","permission":[{"id":"modelperm-YfjOENC37iATh6VsjLLpYdeq","object":"model_permission","created":1691514055,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"whisper-1","parent":null},{"id":"gpt-4","object":"model","created":1687882411,"owned_by":"openai","permission":[{"id":"modelperm-ufulBjea4GV50lNUk7TL02lX","object":"model_permission","created":1691192558,"allow_create_engine":false,"allow_sampling":false,"allow_logprobs":false,"allow_search_indices":false,"allow_view":false,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"gpt-4","parent":null},{"id":"ada-code-search-code","object":"model","created":1651172505,"owned_by":"openai-dev","permission":[{"id":"modelperm-469coJJMBDffmGlbftht9QR7","object":"model_permission","created":1690864147,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"ada-code-search-code","parent":null},{"id":"ada","object":"model","created":1649357491,"owned_by":"openai","permission":[{"id":"modelperm-mEzQ65zcTNX233nYMXVZjvmy","object":"model_permission","created":1690950776,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"ada","parent":null},{"id":"text-davinci-edit-001","object":"model","created":1649809179,"owned_by":"openai","permission":[{"id":"modelperm-bwEWUtGiBcdX0p1D1ayafH8w","object":"model_permission","created":1690915020,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-davinci-edit-001","parent":null},{"id":"davinci-search-document","object":"model","created":1651172509,"owned_by":"openai-dev","permission":[{"id":"modelperm-1jEFSTL1yLUnTyI8TekKPGQF","object":"model_permission","created":1690864158,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"davinci-search-document","parent":null},{"id":"gpt-3.5-turbo-16k-0613","object":"model","created":1685474247,"owned_by":"openai","permission":[{"id":"modelperm-pKdL77d1yxIxNMTEveJjuGO2","object":"model_permission","created":1691712115,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"gpt-3.5-turbo-16k-0613","parent":null},{"id":"curie-search-query","object":"model","created":1651172509,"owned_by":"openai-dev","permission":[{"id":"modelperm-fvYLh7mrZBoEXRa9teCq7ZsK","object":"model_permission","created":1690864488,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"curie-search-query","parent":null},{"id":"babbage-similarity","object":"model","created":1651172505,"owned_by":"openai-dev","permission":[{"id":"modelperm-XBmFjRKu34Qvm9Y8Vjg6si3V","object":"model_permission","created":1690864610,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"babbage-similarity","parent":null},{"id":"ada-search-document","object":"model","created":1651172507,"owned_by":"openai-dev","permission":[{"id":"modelperm-jEtYYVTVutQ4BLh2DnGd9tJt","object":"model_permission","created":1690864171,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"ada-search-document","parent":null},{"id":"text-ada-001","object":"model","created":1649364042,"owned_by":"openai","permission":[{"id":"modelperm-jRuB7xBCdj159SqaDmpPgeWO","object":"model_permission","created":1690915029,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-ada-001","parent":null},{"id":"text-similarity-davinci-001","object":"model","created":1651172505,"owned_by":"openai-dev","permission":[{"id":"modelperm-CoAjJ7mSHeO28X7KowOnwvj9","object":"model_permission","created":1690864500,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-similarity-davinci-001","parent":null},{"id":"gpt-3.5-turbo-16k","object":"model","created":1683758102,"owned_by":"openai-internal","permission":[{"id":"modelperm-SQXsS1PDYLBrJJqTg15X1jeQ","object":"model_permission","created":1691712126,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"gpt-3.5-turbo-16k","parent":null},{"id":"curie","object":"model","created":1649359874,"owned_by":"openai","permission":[{"id":"modelperm-0g6LBMO3cgUpTYzehqtF9G1i","object":"model_permission","created":1690950807,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"curie","parent":null},{"id":"curie-similarity","object":"model","created":1651172510,"owned_by":"openai-dev","permission":[{"id":"modelperm-gSmuEPu9Q8KjQhJ5myLNKIIV","object":"model_permission","created":1690864620,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"curie-similarity","parent":null},{"id":"gpt-3.5-turbo-0613","object":"model","created":1686587434,"owned_by":"openai","permission":[{"id":"modelperm-XIXH7QF7QM60DDcON9eaGFfk","object":"model_permission","created":1690842445,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"gpt-3.5-turbo-0613","parent":null},{"id":"babbage-code-search-code","object":"model","created":1651172509,"owned_by":"openai-dev","permission":[{"id":"modelperm-UdNutuGVhzb5EBzlkaztBdMH","object":"model_permission","created":1690864182,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"babbage-code-search-code","parent":null},{"id":"code-search-babbage-code-001","object":"model","created":1651172507,"owned_by":"openai-dev","permission":[{"id":"modelperm-0mO5qmzzKUVVVZ9MIHTnwjwK","object":"model_permission","created":1690864510,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"code-search-babbage-code-001","parent":null},{"id":"text-search-babbage-doc-001","object":"model","created":1651172509,"owned_by":"openai-dev","permission":[{"id":"modelperm-dvJNsLdOcnLbIYlRZRnfQAfX","object":"model_permission","created":1690864628,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":true,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-search-babbage-doc-001","parent":null},{"id":"text-curie-001","object":"model","created":1649364043,"owned_by":"openai","permission":[{"id":"modelperm-vcuXVPe8oCucYrY0hxBNBXRd","object":"model_permission","created":1690915039,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"text-curie-001","parent":null},{"id":"gpt-3.5-turbo-0301","object":"model","created":1677649963,"owned_by":"openai","permission":[{"id":"modelperm-I4IcSJFYZl2fIK0DPSBkgK3d","object":"model_permission","created":1691712139,"allow_create_engine":false,"allow_sampling":true,"allow_logprobs":true,"allow_search_indices":false,"allow_view":true,"allow_fine_tuning":false,"organization":"*","group":null,"is_blocking":false}],"root":"gpt-3.5-turbo-0301","parent":null}]
 */
