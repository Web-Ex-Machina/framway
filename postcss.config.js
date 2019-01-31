module.exports = {
  plugins: [
    require('autoprefixer')({ grid: "no-autoplace" }),
    require('postcss-focus'),
    require('postcss-object-fit-images'),
    require('cssnano')({
        preset: 'default',
    }),
  ]
}