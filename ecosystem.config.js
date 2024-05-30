module.exports = {
    apps: [
      {
        name: "extractor",
        script: "yarn extractor:start",
        watch: true,
        // env: {
        //   NODE_ENV: "production"
        // }
      },
      {
        name: "backend",
        script: "yarn backend:start",
        watch: true,
        // env: {
        //   NODE_ENV: "production"
        // }
      }
    ]
  }