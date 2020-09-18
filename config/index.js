exports.jwtConfig = {
    secret: 'abcdefg',      // 自定义token密钥(随便)
    expiresIn: '1d' // 20 * 60      // 处定义token令牌过期时间
};

exports.dbConfig = {
    host: 'localhost',
    database: 'mall',
    user: 'root',
    password: 'root'
};