const fs = require("fs");
const brandConfig = require("./brandConfig.js");

const readTweets = () => {
  // directory path
  const dir =
    "./tweet-corpus/latvian-tweet-corpus-all-json-files-up-to-27-04-2021";

  // list all files in the directory
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((file) => {
      let newTweets = fs.readFileSync(
        `./tweet-corpus/latvian-tweet-corpus-all-json-files-up-to-27-04-2021/${file}`,
        "utf-8"
      );
      newTweets = JSON.parse(newTweets);
      newTweets.forEach((tweet) => {
        if (!tweet.inReplyToStatusId && !tweet.inReplyToUserId) {
          brandConfig.brandConfig.forEach((brand) => {
            switch (true) {
              case brand.searchNames.some((name) =>
                tweet.message.match(
                  new RegExp(
                    ` (\\n)?(#)?${name}(\\n)? |^(\\n)?(#)?${name}|(#)?${name}(\\n)?$| (\\n)?@?${brand.accountName}(\\n)? |^(\\n)?@?${brand.accountName}|@?${brand.accountName}(\\n)?$`
                  )
                )
              ):
                let existingPeopleTweets = fs.readFileSync(
                  brand.peopleTweets,
                  "utf-8"
                );
                existingPeopleTweets = JSON.parse(existingPeopleTweets);
                existingPeopleTweets.push(tweet);
                const tweetsPeopleJson = JSON.stringify(existingPeopleTweets);
                fs.writeFileSync(brand.peopleTweets, tweetsPeopleJson, "utf-8");
                break;
              case brand.accountName &&
                tweet.userScreenName === brand.accountName:
                let existingBrandTweets = fs.readFileSync(
                  brand.brandFile,
                  "utf-8"
                );
                existingBrandTweets = JSON.parse(existingBrandTweets);
                existingBrandTweets.push(tweet);
                const tweetsBrandJson = JSON.stringify(existingBrandTweets);
                fs.writeFileSync(brand.brandFile, tweetsBrandJson, "utf-8");
                break;
              default:
                break;
            }
          });
        }
      });
    });
  });
};

cleanFiles = () => {
  // directory path
  const dir = "./brandTweets";
  const dir2 = "./peopleTweets";

  // list all files in the directory
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((file) => {
      const tweetsEmpty = JSON.stringify([]);
      fs.writeFileSync(dir + "/" + file, tweetsEmpty, "utf-8");
    });
  });

  // list all files in the directory
  fs.readdir(dir2, (err, files2) => {
    if (err) {
      throw err;
    }

    files2.forEach((file) => {
      const tweetsEmpty = JSON.stringify([]);
      fs.writeFileSync(dir2 + "/" + file, tweetsEmpty, "utf-8");
    });
  });
};

readTweets();
