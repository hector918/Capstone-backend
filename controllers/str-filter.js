function user_input_filter(str){
  //remove all not-stand symbol and quotation mark, for prevent injection
  const regex = /[\p{P}"'\\\/$%@`~^><]/g;
  return str.replace(regex, "");
}

module.exports = { user_input_filter }