import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  Smartphone,
  Building,
  Bell,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Target,
  Wallet,
} from "lucide-react";

const Donate: React.FC = () => {
  const { t } = useTranslation();
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [purpose, setPurpose] = useState<"tithes" | "offerings" | "donations" | "pledges">("tithes");
  const [paymentMethod, setPaymentMethod] = useState<"mobile" | "card" | "bank">("mobile");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Process donation logic here
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">{t('donate.donationSuccessful')}</h2>
          <p className="text-gray-300 mb-6">
            {t('donate.thankYouMessage')}
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition w-full flex items-center justify-center gap-2"
          >
            {t('donate.makeAnotherDonation')} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-white  mt-36  md:mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Donation Form */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-red-500">{t('donate.makeYourDonation')}</h3>

            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl shadow-lg">
              <div className="mb-6">
                <label className="block text-black mb-2">{t('donate.donationAmount')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">$</span>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full text-black pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-black mb-2">{t('donate.purpose')}</label>
                <select
                  value={purpose}
                  onChange={(e) =>
                    setPurpose(e.target.value as "tithes" | "offerings" | "donations" | "pledges")
                  }
                  className="w-full text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="tithes">{t('donate.tithes')}</option>
                  <option value="offerings">{t('donate.offerings')}</option>
                  <option value="donations">{t('donate.donations')}</option>
                  <option value="pledges">{t('donate.pledges')}</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-black mb-2">{t('donate.paymentMethod')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("mobile")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${paymentMethod === "mobile"
                        ? "border-red-500 bg-red-900 bg-opacity-20"
                        : "border-gray-600 bg-gray-400"
                      }`}
                  >
                    <Smartphone className="w-6 h-6 mb-2 text-red-500" />
                    <span className="text-sm">{t('donate.mobileMoney')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${paymentMethod === "card"
                        ? "border-red-500 bg-red-900 bg-opacity-20"
                        : "border-gray-600 bg-gray-400"
                      }`}
                  >
                    <CreditCard className="w-6 h-6 mb-2 text-red-500" />
                    <span className="text-sm">{t('donate.card')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${paymentMethod === "bank"
                        ? "border-red-500 bg-red-900 bg-opacity-20"
                        : "border-gray-600 bg-gray-400"
                      }`}
                  >
                    <Building className="w-6 h-6 mb-2 text-red-500" />
                    <span className="text-sm">{t('donate.bankTransfer')}</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                {t('donate.donateNow')} <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right Column - Features */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-red-500">{t('donate.waysToGive')}</h3>

            <div className="space-y-6">
              <div className="p-6 rounded-xl shadow-lg">
                <h4 className="font-semibold text-red-500 text-lg mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-red-500" />
                  {t('donate.tithesAndOfferings')}
                </h4>
                <p className="text-black">
                  {t('donate.tithesAndOfferingsDesc')}
                </p>
              </div>

              <div className="p-6 rounded-xl shadow-lg">
                <h4 className="font-semibold text-lg mb-2 flex items-center text-red-500 gap-2">
                  <Target className="w-5 h-5 text-red-500" />
                  {t('donate.specialDonations')}
                </h4>
                <p className="text-black">
                  {t('donate.specialDonationsDesc')}
                </p>
              </div>

              <div className="p-6 rounded-xl shadow-lg">
                <h4 className="font-semibold text-lg mb-2 flex items-center text-red-500 gap-2">
                  <Bell className="w-5 h-5 text-red-500" />
                  {t('donate.realTimeNotifications')}
                </h4>
                <p className="text-black">
                  Receive notifications with real-time status updates of your sent donations.
                </p>
                <ul className="mt-3 text-black space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>{t('donate.notification1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>{t('donate.notification2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>{t('donate.notification3')}</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-xl shadow-lg">
                <h4 className="font-semibold text-lg mb-2 flex items-center text-red-500 gap-2">
                  <Wallet className="w-5 h-5 text-red-500" />
                  {t('donate.givingHistory')}
                </h4>
                <p className="text-black">
                  {t('donate.givingHistoryDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
