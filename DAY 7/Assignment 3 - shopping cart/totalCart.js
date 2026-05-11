// note     it doesnt have products object access so need to provide it as an parameter 

const totalValue = (products) => products.map(p => p.price * p.quantity).reduce((total, price) => total + price, 0)

export default totalValue;   
