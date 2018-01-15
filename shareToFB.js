const jimp = require('jimp');

export const saveImageLocale = (backgroundImage) => {
  jimp.read(backgroundImage)
    .then(image => {
      jimp.read('./static_assets/alien.png')
        .then(alien => {
          alien.resize(150, 270)
          jimp.read('./static_assets/astro.png')
            .then(astro => {
              astro.resize(120, 270)
              jimp.loadFont(jimp.FONT_SANS_32_BLACK)
                .then(font => {
                  image.resize(1000, 1000)
                  image.quality(60)
                  image.composite(alien, 50, 50);
                  image.composite(astro, 800, 700)
                  image.print(font, 10, 10, "Nathan are the Winner");
                  image.print(font, 10, 600, "Ahmad you are lose")
                  image.write('./static_assets/vrtoe_share.jpeg')
                })
            })
        })
    })
}
