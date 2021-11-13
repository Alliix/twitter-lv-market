const fs = require("fs");
const { brandConfig } = require("./brandConfig");

const readTweetsLength = () => {
  const dir = "./peopleTweets";
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((file) => {
      let tweets = fs.readFileSync(`${dir}/${file}`, "utf-8");
      tweets = JSON.parse(tweets);
      console.log(`${file}: ${tweets.length} tweets`);
    });
  });
};

const fixRimiTweets = () => {
  const file = "./peopleTweets/rimi.json";

  let rimiTweets = fs.readFileSync(file, "utf-8");
  rimiTweets = JSON.parse(rimiTweets);
  const rimiBrandTweets = rimiTweets.filter(
    (tweet) => tweet.userScreenName === "MansRimi"
  );
  const rimiPeopleTweets = rimiTweets.filter(
    (tweet) => tweet.userScreenName != "MansRimi"
  );
  fs.writeFileSync(
    "./brandTweets/rimi.json",
    JSON.stringify(rimiBrandTweets),
    "utf-8"
  );
  fs.writeFileSync(
    "./peopleTweets/rimi.json",
    JSON.stringify(rimiPeopleTweets),
    "utf-8"
  );
};

readTweetsLength();
