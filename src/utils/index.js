const formatCurrency = (value) => {
  return Number(value / 100).toLocaleString('ms-MY', { style: 'currency', currency: 'MYR' })
};

const formatDate = (value) => {
  return new Date(value).toLocaleString()
};

export {
  formatCurrency,
  formatDate
};
