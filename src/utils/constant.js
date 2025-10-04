const extractPublicId = (url) => {
  const parts = url.split("/");
  const folder = parts[parts.length - 2]; // "mern_profiles"
  const fileName = parts[parts.length - 1]; // "abcd1234xyz.png"
  return `${folder}/${fileName.split(".")[0]}`; // "mern_profiles/abcd1234xyz"
};

module.exports = { extractPublicId };
