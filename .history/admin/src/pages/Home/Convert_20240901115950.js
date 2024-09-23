export const formatNumber = (num) => {
    return (num / 1e9).toFixed(3);
};

export const formatRatio = (ratio) => {
    switch (ratio) {
        case 'growth_rate':
            return 'Growth Rate (%)';
        default:
            return ratio;
     }
};

