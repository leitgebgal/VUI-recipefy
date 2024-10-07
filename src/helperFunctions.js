export const getCategoryIcon = (cat) => {
    switch (cat) {
        case "fast-food":
            return 'mdi-hamburger';
        case "vegan":
            return 'mdi-leaf';
        case "vegetarian":
            return 'mdi-leaf-circle';
        case "seafood":
            return 'mdi-fish';
        case "dessert":
            return 'mdi-muffin'
        case "beef":
            return 'mdi-cow'
        case "chicken":
            return 'mdi-food-drumstick'
        case "pasta":
            return 'mdi-pasta'
        case "bread & doughs":
            return 'mdi-baguette'
    }
}

export const getCategoryColor = (cat) => {
    switch (cat) {
        case "fast-food":
        case "bread & doughs":
        case "pasta":
            return 'orange'
        case "vegan":
            return 'teal';
        case "vegetarian":
            return 'green';
        case "seafood":
            return 'blue';
        case "dessert":
            return 'purple';
        case "beef":
            return 'red';
        case "chicken":
            return 'brown';
    }
}