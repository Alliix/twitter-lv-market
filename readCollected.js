const fs = require("fs");

const readTweetsLength = () => {
  const dir = "./peopleTweets";
  let allNeutral = 0;
  let allPositive = 0;
  let allNegative = 0;
  let allLabeledLength = 0;
  let allLength = 0;
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((file) => {
      let tweets = fs.readFileSync(`${dir}/${file}`, "utf-8");
      tweets = JSON.parse(tweets);
      allLength += tweets.length;
      tweets = tweets.filter((tweet) => tweet.label != null);
      allNeutral += tweets.filter((tweet) => tweet.label === 0).length;
      allPositive += tweets.filter((tweet) => tweet.label === 1).length;
      allNegative += tweets.filter((tweet) => tweet.label === 2).length;
      console.log(`${file}: ${tweets.length} tweets`);
      allLabeledLength += tweets.length;
    });
    console.log("All length: " + allLength);
    console.log("All labeled length: " + allLabeledLength);
    console.log("All neutral length: " + allNeutral);
    console.log("All positive length: " + allPositive);
    console.log("All negative length: " + allNegative);
  });
};

const fixRimiTweets = () => {
  const file = "";

  let rimiTweets = fs.readFileSync(file, "utf-8");
  rimiTweets = JSON.parse(rimiTweets);
  const rimiBrandTweets = rimiTweets.filter(
    (tweet) => tweet.userScreenName === "MansRimi"
  );
  const rimiPeopleTweets = rimiTweets.filter(
    (tweet) => tweet.userScreenName != "MansRimi"
  );
  fs.writeFileSync("", JSON.stringify(rimiBrandTweets), "utf-8");
  fs.writeFileSync("", JSON.stringify(rimiPeopleTweets), "utf-8");
};

const addLabels = () => {
  const dir = "./peopleTweets";
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((file) => {
      let tweets = fs.readFileSync(`${dir}/${file}`, "utf-8");
      tweets = JSON.parse(tweets);
      tweets = tweets.map((tweet) => {
        if (tweet.label != null) {
          if (tweet.label < 0) {
            return { ...tweet, label: 0 };
          } else return tweet;
        } else {
          return { ...tweet, label: null };
        }
      });
      fs.writeFileSync(dir + "/" + file, JSON.stringify(tweets), "utf-8");
    });
  });
};

getLabeledData = () => {
  const dir = "./peopleTweets";
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err;
    }
    let labeledTweets = [];
    files.forEach((file) => {
      try {
        let tweets = fs.readFileSync(`${dir}/${file}`, "utf-8");
        tweets = JSON.parse(tweets);
        labeledTweets = [
          ...labeledTweets,
          ...tweets.filter((tweet) => tweet.label != null),
        ];
      } catch (err) {
        console.log(err, file);
      }
    });
    fs.writeFileSync(
      dir + "/allLabeledTweets.json",
      JSON.stringify(labeledTweets),
      "utf-8"
    );
  });
};

readTweetsLength();
