function ShowProductsList(props) {
    const products = props.products

    if (typeof products === "undefined") {
        return <div>No products</div>
    } else {
        const indexArray = products.map((obj) => (
            <li>{obj.index + "  -  " + obj.name + " -- " + obj.description}</li>
        ))
        return <ul>{indexArray}</ul>
    }
}
export default ShowProductsList
