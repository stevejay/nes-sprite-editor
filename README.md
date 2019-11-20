# nes-sprite-editor

An in-progress creation tool for NES background and sprite data.

## Introduction

This is an in-progress tool to aid with my learning of Nintendo NES games programming, specifically how the graphical assets for a game are specified and manipulated. At the moment it is just a loose collection of widgets, with no data persistence. Nevertheless, it looks pretty sweet :)

## TODO

- Use `useTransition` hook for `react-spring` library when v8.0.6 is release that has the fixed TypeScript typings
- When V5.1 of Storybook is released, it should support baseUrl and so I can get rid of NODE_PATH (https://github.com/storybooks/storybook/issues/6574)

## Package Info

- `babel-loader` and `@babel/core` are installed to remove Storybook peer dependency warnings.

## Resources

- [Dustmop blog posts](http://www.dustmop.io/blog/tag/graphics/)
- [NES-breakout](https://github.com/89erik/NES-breakout) looks to be nicely structured code
- [NES Docs](https://nesdev.com/NESDoc.pdf)
- [NES game in 40kb](https://www.youtube.com/watch?v=ZWQ0591PAxM)
- [NES hello world game](https://github.com/camsaul/nes-asm/blob/master/hello_world.asm)
- Creating NES graphics: [here](https://megacatstudios.com/blogs/press/creating-nes-graphics) and [here](https://www.dustmop.io/blog/2015/06/08/nes-graphics-part-2/)
- [Pattern tables](http://wiki.nesdev.com/w/index.php/PPU_pattern_tables)
