import emojiData from "./emoji.json";

const names = ["dog", "dog2", "dolphin", "cat"];

export default Object.fromEntries(names.map((name) => [name, emojiData[name]]));
