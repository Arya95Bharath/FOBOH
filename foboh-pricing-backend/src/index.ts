import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(` API endpoints available at:`);
  console.log(`   - Products: http://localhost:${PORT}/api/products`);
  console.log(`   - Pricing Profiles: http://localhost:${PORT}/api/pricing-profiles`);
  console.log(`   - Reference Data: http://localhost:${PORT}/api/reference/categories`);
});