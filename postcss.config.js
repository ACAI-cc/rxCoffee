module.exports = {
    plugins: {
      'postcss-pxtorem': {
        //需要以iphone6作为标准屏
        rootValue: 37.5,
        propList: ['*'],
      },
    },
  };
  