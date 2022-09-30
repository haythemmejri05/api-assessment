import cc from 'currency-converter-lt';

export default {
    convertToCurrency: async (from, to, amount) => {
        const currencyConverter = new cc();
        const res = await currencyConverter.from(from).to(to).amount(amount).convert();
        console.log("new Amount:", res);
        return res;
    },
    activeCurrencies: ["USD", "GBP", "EUR", "JOD", "JPY"],
}