const fs = require("fs");
const brandConfig = require("./brandConfig.js");

const tweetIsInArray = (newTweet, existingTweets) =>
  existingTweets.find(
    (existingTweet) => newTweet.tweetId === existingTweet.tweetId
  );

const returnOriginalTweet = (newTweet, existingTweets) => {
  newTweet.retweetedId &&
    existingTweets.find(
      (existingTweet) => newTweet.retweetedId === existingTweet.tweetId
    );
};

const renameFiles = () => {
  const dir =
    "./tweet-corpus/latvian-tweet-corpus-all-json-files-up-to-27-04-2021";
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const dateParts = file.split("-");
    const rearrangedDateParts = [
      dateParts[0],
      dateParts[3],
      dateParts[2],
      dateParts[1],
      ...dateParts.slice(4),
    ];
    rearrangedDateParts[2] =
      rearrangedDateParts[2].length < 2
        ? "0" + rearrangedDateParts[2]
        : rearrangedDateParts[2];
    rearrangedDateParts[3] =
      rearrangedDateParts[3].length < 2
        ? "0" + rearrangedDateParts[3]
        : rearrangedDateParts[3];
    const newFileName = rearrangedDateParts.join("-");
    fs.rename(dir + "/" + file, dir + "/" + newFileName, (err) => {
      if (err) console.log(err);
    });
  }
};

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
      console.log(
        `Reading file ${file} (${files.findIndex((f) => f === file) + 1} of ${
          files.length
        })`
      );
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
                    ` (\\n)?(#)?${name}(\\n)? |^(\\n)?(#)?${name}|(#)?${name}(\\n)?$| (\\n)?@?${brand.accountName}(\\n)? |^(\\n)?@?${brand.accountName}|@?${brand.accountName}(\\n)?$`,
                    "ig"
                  )
                )
              ):
                let existingPeopleTweets = fs.readFileSync(
                  brand.peopleTweets,
                  "utf-8"
                );
                existingPeopleTweets = JSON.parse(existingPeopleTweets);
                let existingBrandTweetsToCheckRetweet = fs.readFileSync(
                  brand.brandFile,
                  "utf-8"
                );
                existingBrandTweetsToCheckRetweet = JSON.parse(
                  existingBrandTweetsToCheckRetweet
                );
                //handle retweet
                const originalTweetInPeopleTweets = returnOriginalTweet(
                  tweet,
                  existingPeopleTweets
                );
                if (originalTweetInPeopleTweets) {
                  existingPeopleTweets = existingPeopleTweets.map(
                    (existingTweet) => {
                      if (
                        existingTweet.tweetId ===
                        originalTweetInPeopleTweets.tweetId
                      )
                        existingTweet.retweetCount++;
                    }
                  );
                } else {
                  const originalTweetInBrandTweets = returnOriginalTweet(
                    tweet,
                    existingBrandTweetsToCheckRetweet
                  );
                  if (originalTweetInBrandTweets) {
                    existingBrandTweetsToCheckRetweet =
                      existingBrandTweetsToCheckRetweet.map((existingTweet) => {
                        if (
                          existingTweet.tweetId ===
                          originalTweetInBrandTweets.tweetId
                        )
                          existingTweet.retweetCount++;
                      });
                  } else {
                    //check unique
                    if (!tweetIsInArray(tweet, existingPeopleTweets)) {
                      existingPeopleTweets.push({
                        ...tweet,
                        retweetCount: 0,
                      });
                    }
                  }
                }
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
                //check unique
                if (
                  !tweetIsInArray(tweet, existingBrandTweets) &&
                  !tweet.retweetedId
                ) {
                  existingBrandTweets.push({ ...tweet, retweetCount: 0 });
                  const tweetsBrandJson = JSON.stringify(existingBrandTweets);
                  fs.writeFileSync(brand.brandFile, tweetsBrandJson, "utf-8");
                }
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

const cleanFiles = () => {
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
