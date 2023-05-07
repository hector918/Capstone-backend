function user_input_filter(str){
  //remove all not-stand symbol and quotation mark, for prevent injection
  const regex = /[\p{P}"'\\\/$%@`~^><]/g;
  try {
    return str.replace(regex, "");
  } catch (error) {
    return false;    
  }
}

module.exports = { user_input_filter }