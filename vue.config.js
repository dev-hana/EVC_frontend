// 빌드시 backend와 연결
module.exports = { 
  devServer: {
    proxy: { 
      '/api': { 
        target: 'http://localhost:3000/api',
        changeOrigin: true, 
        pathRewrite: { 
          '^/api': ''
        } 
      } 
    } 
  },
  outputDir: '../EVC_backend/public', 
}
