A springy, composable parallax-scroller for React.

![intro](intro.gif)

Demo: http://react-springy-parallax.surge.sh

Simple example: http://react-springy-parallax-simple.surge.sh

Example source: https://github.com/drcmda/react-springy-parallax/blob/master/example/index.js

    npm install react-springy-parallax --save
    
How to use

```js
import Parallax from 'react-springy-parallax'
    
// Pages determines the total height of the inner content container
// Each page takes 100% height of the visible outer container by default
<Parallax ref="parallax" pages={3}>
    // Add as many layers as you like
    <Parallax.Layer
        // Page offset, or where the layer will be at when scrolled to
        // 0 means start, 1 second page, 1.5 second and half, and so on ...
        offset={0}
        // Parallax factor, allows for positive and negative values
        // Shifts the layer up or down in accordance to its offset
        speed={0.5}
        // Layer accepts all common props like styles, classNames, events
        style={styles}
        // The main Parallax component has automated scrolling built in
        onClick={() => this.refs.parallax.scrollTo(1)}>
        
        // Layers can contain anything 
        <span>Click!</span>
        
    </Parallax.Layer>
