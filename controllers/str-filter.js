const userIdRegex = {
  regex: "^[a-zA-Z0-9_]{4,12}$",
  explanation : [
    'matches any alphanumeric character or underscore.',
    `specifies the minimum and maximum length of the user ID, which in this case is between 4 and 12 characters.`,
  ],
  forHint: [
    ["^[a-zA-Z0-9_]{4,12}$", '- User Id should between 4 - 12 characters long.'],
    ["^[a-zA-Z0-9_]{4,12}$", '- and contain only letters, digits, or underscores.']
  ]
};
const passwordRegex = {
  regex: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
  explanation: [
    `requires at least one lowercase letter.`,
    `requires at least one uppercase letter.`,
    `requires at least one digit.`,
    `requires at least one special character (e.g., @, $, !, %, *, ?, or &).`,
    `matches a combination of letters, digits, and special characters, with a minimum length of 8 characters.`,
  ],
  forHint: [
    ["^(?=.*[a-z])", '- requires at least one lowercase letter.'],
    ["^(?=.*[A-Z])", '- requires at least one uppercase letter.'],
    [`\\d`, '- requires at least one digit.'],
    ["^(?=.*[@$!%*?&])", '- requires at least one special character (e.g., @, $, !, %, *, ?, or &).'],
    ["^[A-Za-z\\d@$!%*?&]{8,}$", '- with a minimum length of 8 characters.']
  ]
};
//////////////////////////////////////////
function accept_file_only(str){
  const regex = /[^a-zA-Z0-9.]/g;
  try {
    return str.replaceAll(regex, "").replaceAll(/\.{2,}/g, "");
  } catch (error) {
    console.error(error);
    return "";
  }
}
/////////////////////////////////////////
function user_input_filter(str){
  //remove all not-stand symbol and quotation mark, for prevent injection
  const regex = /[\p{P}"'\\\/$%@`~^><]/g;
  try {
    // console.log(str)
    return str.replace(regex, "");
  } catch (error) {
    console.log(error);
    return false;    
  }
}

function user_input_letter_and_numbers_only(str){
  const regex = /\W+/g;
  try {
    return str.replace(regex, "");
  } catch (error) {
    console.log(error);
    return false;    
  }
}
////////////////////////////////////////
module.exports = { 
  user_input_filter, 
  user_input_letter_and_numbers_only,
  userIdRegex, passwordRegex,
  accept_file_only,
 }