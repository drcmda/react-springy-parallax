A springy, composable parallax-scroller for React.

![intro](intro.gif)

Demo: react-springy-parallax.surge.sh

    npm install react-springy-parallax --save

    // Pages determines the total height of the inner content container
    // Each page takes 100% height of the visible container by default
    <Parallax ref="parallax" pages={3}>
        // Add as many layers as you like
        <Parallax.Layer
            // Page offset, or where the layer will be at
            // 0 means start, 1 second page, and so on ...
            offset={0}
            // Parallax factor, allows for positive and negative values
            // Shifts the layer up or down in accordance to its offset
            speed={0.5}
            // Layer accepts all common props like styles, classNames, events
            style={styles}
            // The main Parallax component has automated scrolling built in
            onClick={() => this.refs.parallax.scrollTo(1)}>
            Click!
        </Parallax.Layer>
