export const formatNumber = (num) => {
    return (num / 1e9).toFixed(3);
};

export const formatRatio = (ratio) => {
    switch (ratio) {
        case 'croissance_CA_1_an':
            return 'Growth Rate (%)';
        default:
            return ratio;
     }
};

