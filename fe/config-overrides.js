module.exports = function override(config, env) {
    // 修改输出文件名
    if (env === 'production') {
        config.output.filename = 'main.js';
    }
    return config;
};
