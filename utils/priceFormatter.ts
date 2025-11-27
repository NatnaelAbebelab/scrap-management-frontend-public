const formattedPrice = new Intl.NumberFormat('en-ET', {
    style: 'decimal',
    maximumFractionDigits: 2,
});

export const formatPrice = (price: string) => {
    return formattedPrice.format(Number(price));
};