"use client";

const SubscriptionTypes = [
  { priority: 0, name: "Free", price: "0.00" },
  { priority: 1, name: "Basic", price: "5.00" },
  { priority: 2, name: "Premium", price: "10.00" },
];

export default function SubscriptionsClient({ isLoggedIn }) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <h1 className="text-3xl font-bold text-indigo-800 mb-8">Subscription Plans</h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {SubscriptionTypes.map((plan) => (
          <div
            key={plan.name}
            className="bg-white/90 shadow-xl rounded-2xl p-8 w-72 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">{plan.name}</h2>
            <div className="text-3xl font-bold mb-4 text-indigo-900">${plan.price}</div>
            <ul className="mb-6 text-gray-600 text-sm">
              <li>
                {plan.name === "Free" && "Access to basic features"}
                {plan.name === "Basic" && "Access to basic + extra features"}
                {plan.name === "Premium" && "All features unlocked"}
              </li>
            </ul>
            <button
              className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                isLoggedIn
                  ? "bg-indigo-700 hover:bg-indigo-800 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isLoggedIn}
              onClick={() => {
                if (isLoggedIn) {
                  alert(`You have selected the ${plan.name} plan!`);
                  // Trigger buy/subscribe logic here
                }
              }}
            >
              {isLoggedIn ? "Buy" : "Login to Buy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}