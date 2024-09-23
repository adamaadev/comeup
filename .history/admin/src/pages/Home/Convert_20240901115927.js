export const formatNumber = (num) => {
    return (num / 1e9).toFixed(3);
};

export const formatRatio = (ratio) => {
    switch (ratio) {
        case 'growth_rate':
            return 'Growth Rate (%)';
        case 'debt_equity':
            return 'Debt to Equity Ratio';
        case 'payout_ratio':
            return 'Payout Ratio (%)';
        // Add more cases as needed
        default:
            return ratio; // Return the original value if no match is found
    }
};

