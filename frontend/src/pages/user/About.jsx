// src/pages/user/About.jsx
const About = () => {
  return (
    <div className="min-h-screen bg-light-bg py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-primary">
          About Café Delight ☕
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 mb-8">
          <div className="text-6xl text-center mb-6">🍕☕🍰</div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Welcome to Café Delight, your go-to destination for delicious food and beverages delivered right to your doorstep. Since 2020, we've been serving the community of Jaipur with passion, quality, and a commitment to excellence.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our menu features a carefully curated selection of coffee, pizzas, desserts, beverages, and snacks—all prepared fresh daily by our talented team of chefs. We believe in using only the finest ingredients to create meals that not only satisfy your hunger but also bring joy to your day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-dark mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To deliver happiness through exceptional food and outstanding service.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="text-xl font-bold text-dark mb-2">Our Values</h3>
            <p className="text-gray-600">
              Quality, freshness, and customer satisfaction are at the heart of everything we do.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-dark mb-2">Our Promise</h3>
            <p className="text-gray-600">
              Fast delivery, hot food, and a smile with every order.
            </p>
          </div>
        </div>

        <div className="bg-primary text-white rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>100% Fresh Ingredients</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>Fast & Reliable Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>Affordable Prices</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>Easy Online Ordering</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>Hygenic Preparation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <span>Excellent Customer Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;